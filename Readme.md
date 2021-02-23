This is my first browser extension.

## To install locally:

### FireFox
<pre>
Hamberger -> Web Developer -> Remote Debugging -> This FireFox -> Load Temporary Add-on...
</pre>

### chrome/chromium
<pre>
ThreeDot -> Settings -> Exztensions -> Load Unpacked
</pre>

## Source Code for Specific Version

### Git
<pre>
git clone https://github.com/jozsefmorrissey/ContentExplained.git
git checkout v[version]
</pre>
  -- bin folder contains built extension
### Zip
    https://node.jozsefmorrissey.com/content-explained/versions/[version].zip
#### Latest
      https://node.jozsefmorrissey.com/content-explained/versions/1.2.zip

## Developemet

### Build Requirements
  should work with any os however have tested
    - Linux Mint 19.3 Tricia 64-bit
    - Ubuntu 18.04.3 LTS
  requried installations
    - node (8.10.0)
    - npm (3.5.2)
### Install
npm install
### Build Process
  node ./watch.js [local|dev|prod]

## On the fly server updates:
rebooting the server will change the serverId this values is sent in all
responses as a ce-server-id header. Changing this value will notify all running
applications that the server has been updated. Which will cause them to update
thier...
<ul>
  <li>endpoints</li>
</ul>


# TODO
- Add commenting
- Add tab compression
- clean css....(Big Job)
- siteid generalization...
