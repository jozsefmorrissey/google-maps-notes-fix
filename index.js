

class Properties {
  constructor (defaults) {
    const properties = {};
    defaults = defaults || {};
    const updateFuncs = {};
    const instanceId = Properties.freeId++;
    const instance = this;
    const idKey = () => `properties${instanceId}Id`;
    const keysKey = () => `properties${instanceId}Keys`;
    let pendingNotification = false;

    let notificationList = {};

    function notify() {
      const funcs = Object.values(notificationList);
      notificationList = {};
      pendingNotification = false;
      for (let index = 0; index < funcs.length; index += 1) {
        const func = funcs[index];
        func(instance.get.apply(null, func[keysKey()]));
      }
    }

    function stage(key) {
      if (!pendingNotification) {
        pendingNotification = true;
        setTimeout(notify, 100);
      }
      const funcList = updateFuncs[key];
      for (let index = 0; funcList && index < funcList.length; index += 1) {
        const func = funcList[index];
        notificationList[func[idKey()]] = func;
      }
    }

    this.set = function (key, value, storeIt) {
        properties[key] = value;
        if (storeIt) {
          const storeObj = {};
          storeObj[key] = value;
          chrome.storage.local.set(storeObj);
        } else {
          stage(key);
        }
    };

    this.get = function (key) {
      if (arguments.length === 1) {
        return properties[key]
      }
      const retObj = {};
      for (let index = 0; index < arguments.length; index += 1) {
        key = arguments[index];
        const value = properties[key];
        if (value && (typeof value) === 'object') {
          retObj[key] = JSON.parse(JSON.stringify(value));
        } else {
          retObj[key] = value;
        }
      }
      return retObj;
    };

    function storageUpdate (values) {
      const keys = Object.keys(values);
      for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];
        const value = values[key];
        if (value && value.newValue !== undefined) {
          if (value.newValue !== value.oldValue) {
            instance.set(key, value.newValue);
          }
        } else if (value !== properties[key]) {
          instance.set(key, value);
        }
      }
      const defKeys = Object.keys(defaults);
      for (let index = 0; index < defKeys.length; index += 1) {
        const key = defKeys[index];
        if (values[key] === undefined) {
          instance.set(key, defaults[key]);
        }
      }

    }

    function keyDefinitionCheck(key) {
      if (key === undefined) {
        throw new Error('key must be defined');
      }
    }

    this.onUpdate = function (keys, func) {
      keyDefinitionCheck(keys);
      if (!Array.isArray(keys)) {
        keys = [keys];
      }
      func[idKey()] = Properties.freeId++;
      func[keysKey()] = keys;
      if ((typeof func) !== 'function') throw new Error('update function must be defined');
      keys.forEach((key) => {
        if (updateFuncs[key] === undefined) {
          updateFuncs[key] = [];
        }
        updateFuncs[key].push(func);
        if (properties[key] !== undefined) {
          func(properties[key]);
        }
      });
    }

    this.toggle = function (key, save) {
      instance.set(key, !instance.get(key), save);
    }

    chrome.storage.local.get(null, storageUpdate);
    chrome.storage.onChanged.addListener(storageUpdate);
  }
}

Properties.freeId = 0;

const properties = new Properties();


console.log('here i am')

function powerOn() {
  return properties.get('powerOff') !== true;
}

function betterStyling(note, power) {
  if (power) {
    if (properties.get('alertMode') === true) {
      note.style.color = 'red';
    } else {
      note.style.color = '';
    }
    if (properties.get('boldMode') === true) {
      note.style.fontWeight = 'bolder';
    } else {
      note.style.fontWeight = '';
    }
  } else {
    note.style.fontWeight = '';
    note.style.color = '';
  }
}

const emptyClass = 'widget-print-notes-empty';
function removeEmptyNoteFlag() {
  const inputSelector = 'input.widget-print-notes.widget-print-notes-secondary';
  const inputs = document.querySelectorAll(inputSelector);
  const power = powerOn();
  for (let index = 0; index < inputs.length; index += 1) {
    const note = inputs[index];
    note.className = note.className.replace(emptyClass, '').trim();
    if (!power || note.value === '') note.className = note.className + ' ' + emptyClass;
    betterStyling(note, power);
  }
  setTimeout(removeEmptyNoteFlag, 3000);
}

setTimeout(removeEmptyNoteFlag, 3000);

properties.onUpdate(['powerOff', 'alertMode', 'boldMode'], removeEmptyNoteFlag);
