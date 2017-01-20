
!function() {
  /**
 *
 * This file is part of Tulip (www.tulip-software.org)
 *
 * Authors: David Auber and the Tulip development Team
 * from LaBRI, University of Bordeaux
 *
 * Tulip is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Tulip is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */

/**
 *
 * tulip.js : port of the Tulip framework to JavaScript through emscripten
 * Copyright (c) 2016 Antoine Lambert, Thales Services SAS
 * antoine-e.lambert@thalesgroup.com / antoine.lambert33@gmail.com
 *
 */

var workerMode = typeof importScripts === 'function';
var nodejs = typeof process == 'object';

function getScriptName() {

  if (nodejs) {
    var scriptPath = getScriptPath();
    var scriptName = __filename;
    scriptName = scriptName.substr(scriptPath.length);
    return scriptName;
  }

  var scriptName
  , source
  , lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+[:]*\d*.*$/)
  , currentStackFrameRegex = new RegExp('getScriptName \\(.+\\/(.*?):\\d+[:]*\\d*.*\\)');

  try {
    var x = v43x76fr.name;
  } catch(error) {

    if((source = lastStackFrameRegex.exec(error.stack.trim())))
      scriptName = source[1];
    else if((source = currentStackFrameRegex.exec(error.stack.trim())))
      scriptName = source[1];
    else if(error.fileName != undefined)
      scriptName = error.fileName;
  }

  if (scriptName && scriptName.indexOf('?r=') != -1) {
    scriptName = scriptName.substr(0, scriptName.indexOf('?r='));
  }

  if (scriptName && scriptName.indexOf('?v=') != -1) {
    scriptName = scriptName.substr(0, scriptName.indexOf('?v='));
  }

  return scriptName;
}

function getScriptPath() {

  if (nodejs) {
    return __dirname + '/';
  }

  var scriptName = getScriptName();

  if (workerMode) {
    var location = self.location;
  } else {
    var location = window.location;
  }

  var origin = location.origin;
  if (location.protocol == 'file:') {
    origin = 'file://';
  }

  var scriptPath
  , source
  , lastStackFrameRegex = new RegExp('.*' + origin + '(.*)' + scriptName + '.*:\\d+[:]*\\d*.*$')
  , currentStackFrameRegex = new RegExp('getScriptPath \\(.*' + origin + '(.*)' + scriptName + '.*:\\d+[:]*\\d*.*\\)');

  try {
    var x = v43x76fr.name;
  } catch(error) {

    if((source = lastStackFrameRegex.exec(error.stack.trim())))
      scriptPath = source[1];
    else if((source = currentStackFrameRegex.exec(error.stack.trim())))
      scriptPath = source[1];

    if (location.protocol == 'file:') {
      var scriptPathTokens = scriptPath.split('/');
      var pathnameTokens = location.pathname.split('/');
      for (var i = 0 ; i < scriptPathTokens.length ; ++i) {
        if (scriptPathTokens[i] != pathnameTokens[i]) {
          break;
        }
      }
      scriptPath = '';
      for (var j = i ; j < scriptPathTokens.length ; ++j) {
        if (scriptPathTokens[j] == '') {
          break;
        }
        scriptPath += (scriptPathTokens[j] + '/');
      }
    }
  }

  return scriptPath;
}

  var tulipjs = function(tulipjs) {
  tulipjs = tulipjs || {};
  var Module = tulipjs;


var Module;

if (typeof Module === 'undefined') Module = {};

if (!Module.expectedDataFileDownloads) {
  Module.expectedDataFileDownloads = 0;
  Module.finishedDataFileDownloads = 0;
}
Module.expectedDataFileDownloads++;
(function() {
 var loadPackage = function(metadata) {

    var PACKAGE_PATH;
    if (typeof window === 'object') {
      PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
    } else if (typeof location !== 'undefined') {
      // worker
      PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
    } else {
      throw 'using preloaded data can only be done on a web page or in a web worker';
    }
    var PACKAGE_NAME = 'tulip.data';
    var REMOTE_PACKAGE_BASE = 'tulip.data';
    if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
      Module['locateFile'] = Module['locateFilePackage'];
      Module.printErr('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
    }
    var REMOTE_PACKAGE_NAME = typeof Module['locateFile'] === 'function' ?
                              Module['locateFile'](REMOTE_PACKAGE_BASE) :
                              ((Module['filePackagePrefixURL'] || '') + REMOTE_PACKAGE_BASE);
  
    var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
    var PACKAGE_UUID = metadata.package_uuid;
  
    function fetchRemotePackage(packageName, packageSize, callback, errback) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', packageName, true);
      xhr.responseType = 'arraybuffer';
      xhr.onprogress = function(event) {
        var url = packageName;
        var size = packageSize;
        if (event.total) size = event.total;
        if (event.loaded) {
          if (!xhr.addedTotal) {
            xhr.addedTotal = true;
            if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
            Module.dataFileDownloads[url] = {
              loaded: event.loaded,
              total: size
            };
          } else {
            Module.dataFileDownloads[url].loaded = event.loaded;
          }
          var total = 0;
          var loaded = 0;
          var num = 0;
          for (var download in Module.dataFileDownloads) {
          var data = Module.dataFileDownloads[download];
            total += data.total;
            loaded += data.loaded;
            num++;
          }
          total = Math.ceil(total * Module.expectedDataFileDownloads/num);
          if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
        } else if (!Module.dataFileDownloads) {
          if (Module['setStatus']) Module['setStatus']('Downloading data...');
        }
      };
      xhr.onerror = function(event) {
        throw new Error("NetworkError for: " + packageName);
      }
      xhr.onload = function(event) {
        if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
          var packageData = xhr.response;
          callback(packageData);
        } else {
          throw new Error(xhr.statusText + " : " + xhr.responseURL);
        }
      };
      xhr.send(null);
    };

    function handleError(error) {
      console.error('package error:', error);
    };
  
      var fetched = null, fetchedCallback = null;
      fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
        if (fetchedCallback) {
          fetchedCallback(data);
          fetchedCallback = null;
        } else {
          fetched = data;
        }
      }, handleError);
    
  function runWithFS() {

    function assert(check, msg) {
      if (!check) throw msg + new Error().stack;
    }
Module['FS_createPath']('/', 'resources', true, true);

    function DataRequest(start, end, crunched, audio) {
      this.start = start;
      this.end = end;
      this.crunched = crunched;
      this.audio = audio;
    }
    DataRequest.prototype = {
      requests: {},
      open: function(mode, name) {
        this.name = name;
        this.requests[name] = this;
        Module['addRunDependency']('fp ' + this.name);
      },
      send: function() {},
      onload: function() {
        var byteArray = this.byteArray.subarray(this.start, this.end);

          this.finish(byteArray);

      },
      finish: function(byteArray) {
        var that = this;

        Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
        Module['removeRunDependency']('fp ' + that.name);

        this.requests[this.name] = null;
      }
    };

  
    function processPackageData(arrayBuffer) {
      Module.finishedDataFileDownloads++;
      assert(arrayBuffer, 'Loading data file failed.');
      assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
      var byteArray = new Uint8Array(arrayBuffer);
      var curr;
      
          var compressedData = {"data":null,"cachedOffset":887901,"cachedIndexes":[-1,-1],"cachedChunks":[null,null],"offsets":[0,1602,2667,4371,5970,7640,8924,10398,11653,13141,14950,16655,18397,20166,22075,23746,25524,27311,28965,30549,32313,34109,35022,36332,37882,39251,40939,42629,44269,45909,47381,49008,50829,52724,54651,56670,58334,60174,62144,63342,65178,66897,68355,70263,72099,73790,75601,77537,79245,81000,82874,84678,86320,87838,89552,91374,92887,94500,96201,97929,99928,101814,103252,105176,106836,108737,110292,112246,114049,115572,116984,119022,120739,122455,124108,125838,127885,129933,131981,134029,136077,138125,139919,141171,142784,143949,144895,146588,147716,148871,150103,151447,152864,154472,156167,157394,159100,160065,160653,161118,161549,162795,164555,165999,167743,169235,170774,172718,174709,176642,178602,180547,182402,184371,186297,188167,190045,191994,193774,195592,197401,199223,200884,202730,204409,206331,208299,210294,212233,214139,215811,217577,219315,221306,223124,224895,226683,228398,230242,232201,233957,235612,237297,239069,240850,242686,244460,246442,248387,250376,252292,254122,255982,257784,259706,261603,263457,265171,266890,268595,270419,272093,273749,275341,277176,278991,280827,282654,284473,286294,288150,290018,291839,293590,295169,296852,298722,300483,302408,304208,306061,307861,309726,311568,313522,315471,317420,319163,320597,321976,323494,324949,326439,328133,329729,331406,332528,334346,336173,337969,339826,341623,343448,344878,346451,347665,348733,349847,351274,352854,354660,356453,358395,360298,362097,364020,365985,367918,369899,371285,372664,374328,375911,377525,379113,380957,382769,383991,385298,386967,388543,390195,391258,392649,394435,396041,397597,399410,400596,402168,403415,404681,405996,407121,408606,409761,411239,412658,414042,415431,417068,418915,420852,422822,424820,426589,428523,430459,432264,434181,436168,436976,438466,439465,441413,443375,444973,446535,448205,450000,451937,453474,454878,456624,458175,459905,461470,463206,464969,466468,467805,468981,470448,472200,473958,475153,475669,476106,476579,477016,477378,478946,480301,481628,482808,484016,485597,487554,489459,491281,493059,494958,496630,498312,499471,501337,502899,504568,506386,508281,510001,510629,512516,514459,515952,517148,518696,520113,521535,523078,524511,526190,528013,529811,530545,531806,533722,535528,537323,538938,540387,541181,541997,542949,543519,544421,545038,545619,546233,546855,547502,548453,549180,549970,550755,551458,552170,552959,553687,554473,555086,556008,556997,557993,558996,560112,561149,562058,563655,565466,566605,567763,568712,569682,571022,572491,573993,575318,577005,578640,580272,581926,583262,584668,586104,587454,588679,589980,591431,592775,594412,595831,597527,599197,600459,601637,603217,604161,605395,606123,607448,608616,609632,611190,612774,614376,615860,617397,618958,620551,622116,624164,626212,628260,630308,632365,634304,636352,638400,640448,642496,644482,646530,647837,649026,650411,651643,652962,654442,656042,657794,659842,661890,663938,665986,668034,670064,671239,672318,673487,674538,675586,676750,677800,678860,679926,680982,682142,683331,684460,685575,686661,687713,688795,689960,691075,692131,693410,694706,695672,696484,697995,698023,698051,698079,699199,701247,703295,705343,706984,708653,710487,712268,713275,714981,716141,717315,719111,720769,722274,723589,725139,726835,728425,730152,731848,733400,734780,736134,737627,738811,740405,742101,743716,744973,746468,748293,749765,751645,753044,754728,756603,758100,759631,761144,762805,764508,766315,768148,769868,771627,773280,775056,776535,778131,779717,781278,783094,784583,786257,787950,789310,790351,791994,793680,795402,796885,798642,800240,801963,803694,805398,807231,809060,810897,812307,814042,815836,817581,819373,821182,822692,824451,826113,827748,829310,831115,832678,834282,836013,837602,839052,840805,842648,844456,846261,847968,849867,851657,853357,855052,856795,858504,860083,861789,863529,865290,867079,868826,870823,872767,874007,875283,876660,878009,879414,880695,882109,883664,885138,886683],"sizes":[1602,1065,1704,1599,1670,1284,1474,1255,1488,1809,1705,1742,1769,1909,1671,1778,1787,1654,1584,1764,1796,913,1310,1550,1369,1688,1690,1640,1640,1472,1627,1821,1895,1927,2019,1664,1840,1970,1198,1836,1719,1458,1908,1836,1691,1811,1936,1708,1755,1874,1804,1642,1518,1714,1822,1513,1613,1701,1728,1999,1886,1438,1924,1660,1901,1555,1954,1803,1523,1412,2038,1717,1716,1653,1730,2047,2048,2048,2048,2048,2048,1794,1252,1613,1165,946,1693,1128,1155,1232,1344,1417,1608,1695,1227,1706,965,588,465,431,1246,1760,1444,1744,1492,1539,1944,1991,1933,1960,1945,1855,1969,1926,1870,1878,1949,1780,1818,1809,1822,1661,1846,1679,1922,1968,1995,1939,1906,1672,1766,1738,1991,1818,1771,1788,1715,1844,1959,1756,1655,1685,1772,1781,1836,1774,1982,1945,1989,1916,1830,1860,1802,1922,1897,1854,1714,1719,1705,1824,1674,1656,1592,1835,1815,1836,1827,1819,1821,1856,1868,1821,1751,1579,1683,1870,1761,1925,1800,1853,1800,1865,1842,1954,1949,1949,1743,1434,1379,1518,1455,1490,1694,1596,1677,1122,1818,1827,1796,1857,1797,1825,1430,1573,1214,1068,1114,1427,1580,1806,1793,1942,1903,1799,1923,1965,1933,1981,1386,1379,1664,1583,1614,1588,1844,1812,1222,1307,1669,1576,1652,1063,1391,1786,1606,1556,1813,1186,1572,1247,1266,1315,1125,1485,1155,1478,1419,1384,1389,1637,1847,1937,1970,1998,1769,1934,1936,1805,1917,1987,808,1490,999,1948,1962,1598,1562,1670,1795,1937,1537,1404,1746,1551,1730,1565,1736,1763,1499,1337,1176,1467,1752,1758,1195,516,437,473,437,362,1568,1355,1327,1180,1208,1581,1957,1905,1822,1778,1899,1672,1682,1159,1866,1562,1669,1818,1895,1720,628,1887,1943,1493,1196,1548,1417,1422,1543,1433,1679,1823,1798,734,1261,1916,1806,1795,1615,1449,794,816,952,570,902,617,581,614,622,647,951,727,790,785,703,712,789,728,786,613,922,989,996,1003,1116,1037,909,1597,1811,1139,1158,949,970,1340,1469,1502,1325,1687,1635,1632,1654,1336,1406,1436,1350,1225,1301,1451,1344,1637,1419,1696,1670,1262,1178,1580,944,1234,728,1325,1168,1016,1558,1584,1602,1484,1537,1561,1593,1565,2048,2048,2048,2048,2057,1939,2048,2048,2048,2048,1986,2048,1307,1189,1385,1232,1319,1480,1600,1752,2048,2048,2048,2048,2048,2030,1175,1079,1169,1051,1048,1164,1050,1060,1066,1056,1160,1189,1129,1115,1086,1052,1082,1165,1115,1056,1279,1296,966,812,1511,28,28,28,1120,2048,2048,2048,1641,1669,1834,1781,1007,1706,1160,1174,1796,1658,1505,1315,1550,1696,1590,1727,1696,1552,1380,1354,1493,1184,1594,1696,1615,1257,1495,1825,1472,1880,1399,1684,1875,1497,1531,1513,1661,1703,1807,1833,1720,1759,1653,1776,1479,1596,1586,1561,1816,1489,1674,1693,1360,1041,1643,1686,1722,1483,1757,1598,1723,1731,1704,1833,1829,1837,1410,1735,1794,1745,1792,1809,1510,1759,1662,1635,1562,1805,1563,1604,1731,1589,1450,1753,1843,1808,1805,1707,1899,1790,1700,1695,1743,1709,1579,1706,1740,1761,1789,1747,1997,1944,1240,1276,1377,1349,1405,1281,1414,1555,1474,1545,1218],"successes":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
;
          compressedData.data = byteArray;
          assert(typeof LZ4 === 'object', 'LZ4 not present - was your app build with  -s LZ4=1  ?');
          LZ4.loadPackage({ 'metadata': metadata, 'compressedData': compressedData });
          Module['removeRunDependency']('datafile_tulip.data');
    
    };
    Module['addRunDependency']('datafile_tulip.data');
  
    if (!Module.preloadResults) Module.preloadResults = {};
  
      Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
      if (fetched) {
        processPackageData(fetched);
        fetched = null;
      } else {
        fetchedCallback = processPackageData;
      }
    
  }
  if (Module['calledRun']) {
    runWithFS();
  } else {
    if (!Module['preRun']) Module['preRun'] = [];
    Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
  }

 }
 loadPackage({"files": [{"audio": 0, "start": 0, "crunched": 0, "end": 152796, "filename": "/resources/fontawesome-webfont.ttf"}, {"audio": 0, "start": 152796, "crunched": 0, "end": 153594, "filename": "/resources/cylinderTexture.png"}, {"audio": 0, "start": 153594, "crunched": 0, "end": 166107, "filename": "/resources/radialGradientTexture.png"}, {"audio": 0, "start": 166107, "crunched": 0, "end": 923183, "filename": "/resources/font.ttf"}, {"audio": 0, "start": 923183, "crunched": 0, "end": 1168859, "filename": "/resources/materialdesignicons-webfont.ttf"}], "remote_package_size": 891997, "package_uuid": "7d7c0c1f-e43b-4960-a932-7a984ddfd4b9"});

})();

/**
 *
 * This file is part of Tulip (www.tulip-software.org)
 *
 * Authors: David Auber and the Tulip development Team
 * from LaBRI, University of Bordeaux
 *
 * Tulip is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Tulip is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */

/**
 *
 * tulip.js : port of the Tulip framework to JavaScript through emscripten
 * Copyright (c) 2016 Antoine Lambert, Thales Services SAS
 * antoine-e.lambert@thalesgroup.com / antoine.lambert33@gmail.com
 *
 */

Module.workerMode = workerMode;

if (workerMode) {

  Module.print = function(msg) {
    self.postMessage({eventType: 'print', text: msg});
  };

  Module.printErr = function(msg) {
    self.postMessage({eventType: 'print', text: msg});
  };
}

Module.noExitRuntime = true;

if (nodejs) {
  Module.preRun = function() {
    FS.mkdir('root');
    FS.mount(NODEFS, { root: process.cwd() }, 'root');
    FS.chdir('root');
  };
}

// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = (typeof tulipjs !== 'undefined' ? tulipjs : null) || {};

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;

// Three configurations we can be running in:
// 1) We could be the application main() thread running in the main JS UI thread. (ENVIRONMENT_IS_WORKER == false and ENVIRONMENT_IS_PTHREAD == false)
// 2) We could be the application main() thread proxied to worker. (with Emscripten -s PROXY_TO_WORKER=1) (ENVIRONMENT_IS_WORKER == true, ENVIRONMENT_IS_PTHREAD == false)
// 3) We could be an application pthread running in a worker. (ENVIRONMENT_IS_WORKER == true and ENVIRONMENT_IS_PTHREAD == true)

if (Module['ENVIRONMENT']) {
  if (Module['ENVIRONMENT'] === 'WEB') {
    ENVIRONMENT_IS_WEB = true;
  } else if (Module['ENVIRONMENT'] === 'WORKER') {
    ENVIRONMENT_IS_WORKER = true;
  } else if (Module['ENVIRONMENT'] === 'NODE') {
    ENVIRONMENT_IS_NODE = true;
  } else if (Module['ENVIRONMENT'] === 'SHELL') {
    ENVIRONMENT_IS_SHELL = true;
  } else {
    throw new Error('The provided Module[\'ENVIRONMENT\'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.');
  }
} else {
  ENVIRONMENT_IS_WEB = typeof window === 'object';
  ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
  ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function' && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
  ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
}


if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = console.log;
  if (!Module['printErr']) Module['printErr'] = console.warn;

  var nodeFS;
  var nodePath;

  Module['read'] = function read(filename, binary) {
    if (!nodeFS) nodeFS = require('fs');
    if (!nodePath) nodePath = require('path');
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    return binary ? ret : ret.toString();
  };

  Module['readBinary'] = function readBinary(filename) {
    var ret = Module['read'](filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  if (!Module['thisProgram']) {
    if (process['argv'].length > 1) {
      Module['thisProgram'] = process['argv'][1].replace(/\\/g, '/');
    } else {
      Module['thisProgram'] = 'unknown-program';
    }
  }

  Module['arguments'] = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  Module['inspect'] = function () { return '[Emscripten Module object]'; };
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available' };
  }

  Module['readBinary'] = function readBinary(f) {
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    var data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  Module['readAsync'] = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
      } else {
        onerror();
      }
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.warn(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WORKER) {
    Module['load'] = importScripts;
  }

  if (typeof Module['setWindowTitle'] === 'undefined') {
    Module['setWindowTitle'] = function(title) { document.title = title };
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
if (!Module['thisProgram']) {
  Module['thisProgram'] = './this.program';
}

// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = undefined;



/*
 * Copyright 2015 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function integrateWasmJS(Module) {
  // wasm.js has several methods for creating the compiled code module here:
  //  * 'native-wasm' : use native WebAssembly support in the browser
  //  * 'interpret-s-expr': load s-expression code from a .wast and interpret
  //  * 'interpret-binary': load binary wasm and interpret
  //  * 'interpret-asm2wasm': load asm.js code, translate to wasm, and interpret
  //  * 'asmjs': no wasm, just load the asm.js code and use that (good for testing)
  // The method can be set at compile time (BINARYEN_METHOD), or runtime by setting Module['wasmJSMethod'].
  // The method can be a comma-separated list, in which case, we will try the
  // options one by one. Some of them can fail gracefully, and then we can try
  // the next.

  // inputs

  var method = Module['wasmJSMethod'] || (Module['wasmJSMethod'] || "native-wasm") || 'native-wasm'; // by default, use native support
  Module['wasmJSMethod'] = method;

  var wasmTextFile = Module['wasmTextFile'] || "tulip.wast";
  var wasmBinaryFile = Module['wasmBinaryFile'] || "tulip.wasm";
  var asmjsCodeFile = Module['asmjsCodeFile'] || "tulip.asm.js";

  // utilities

  var wasmPageSize = 64*1024;

  var asm2wasmImports = { // special asm2wasm imports
    "f64-rem": function(x, y) {
      return x % y;
    },
    "f64-to-int": function(x) {
      return x | 0;
    },
    "i32s-div": function(x, y) {
      return ((x | 0) / (y | 0)) | 0;
    },
    "i32u-div": function(x, y) {
      return ((x >>> 0) / (y >>> 0)) >>> 0;
    },
    "i32s-rem": function(x, y) {
      return ((x | 0) % (y | 0)) | 0;
    },
    "i32u-rem": function(x, y) {
      return ((x >>> 0) % (y >>> 0)) >>> 0;
    },
    "debugger": function() {
      debugger;
    },
  };

  var info = {
    'global': null,
    'env': null,
    'asm2wasm': asm2wasmImports,
    'parent': Module // Module inside wasm-js.cpp refers to wasm-js.cpp; this allows access to the outside program.
  };

  var exports = null;

  function lookupImport(mod, base) {
    var lookup = info;
    if (mod.indexOf('.') < 0) {
      lookup = (lookup || {})[mod];
    } else {
      var parts = mod.split('.');
      lookup = (lookup || {})[parts[0]];
      lookup = (lookup || {})[parts[1]];
    }
    if (base) {
      lookup = (lookup || {})[base];
    }
    if (lookup === undefined) {
      abort('bad lookupImport to (' + mod + ').' + base);
    }
    return lookup;
  }

  function mergeMemory(newBuffer) {
    // The wasm instance creates its memory. But static init code might have written to
    // buffer already, including the mem init file, and we must copy it over in a proper merge.
    // TODO: avoid this copy, by avoiding such static init writes
    // TODO: in shorter term, just copy up to the last static init write
    var oldBuffer = Module['buffer'];
    if (newBuffer.byteLength < oldBuffer.byteLength) {
      Module['printErr']('the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here');
    }
    var oldView = new Int8Array(oldBuffer);
    var newView = new Int8Array(newBuffer);

    // If we have a mem init file, do not trample it
    if (!memoryInitializer) {
      oldView.set(newView.subarray(Module['STATIC_BASE'], Module['STATIC_BASE'] + Module['STATIC_BUMP']), Module['STATIC_BASE']);
    }

    newView.set(oldView);
    updateGlobalBuffer(newBuffer);
    updateGlobalBufferViews();
  }

  var WasmTypes = {
    none: 0,
    i32: 1,
    i64: 2,
    f32: 3,
    f64: 4
  };

  function fixImports(imports) {
    if (!0) return imports;
    var ret = {};
    for (var i in imports) {
      var fixed = i;
      if (fixed[0] == '_') fixed = fixed.substr(1);
      ret[fixed] = imports[i];
    }
    return ret;
  }

  function getBinary() {
    var binary;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      binary = Module['wasmBinary'];
      assert(binary, "on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)");
      binary = new Uint8Array(binary);
    } else {
      binary = Module['readBinary'](wasmBinaryFile);
    }
    return binary;
  }

  // do-method functions

  function doJustAsm(global, env, providedBuffer) {
    // if no Module.asm, or it's the method handler helper (see below), then apply
    // the asmjs
    if (typeof Module['asm'] !== 'function' || Module['asm'] === methodHandler) {
      if (!Module['asmPreload']) {
        // you can load the .asm.js file before this, to avoid this sync xhr and eval
        eval(Module['read'](asmjsCodeFile)); // set Module.asm
      } else {
        Module['asm'] = Module['asmPreload'];
      }
    }
    if (typeof Module['asm'] !== 'function') {
      Module['printErr']('asm evalling did not set the module properly');
      return false;
    }
    return Module['asm'](global, env, providedBuffer);
  }

  function doNativeWasm(global, env, providedBuffer) {
    if (typeof WebAssembly !== 'object') {
      Module['printErr']('no native wasm support detected');
      return false;
    }
    // prepare memory import
    if (!(Module['wasmMemory'] instanceof WebAssembly.Memory)) {
      Module['printErr']('no native wasm Memory in use');
      return false;
    }
    env['memory'] = Module['wasmMemory'];
    // Load the wasm module and create an instance of using native support in the JS engine.
    info['global'] = {
      'NaN': NaN,
      'Infinity': Infinity
    };
    info['global.Math'] = global.Math;
    info['env'] = env;
    var instance;
    try {
      instance = new WebAssembly.Instance(new WebAssembly.Module(getBinary()), info)
    } catch (e) {
      Module['printErr']('failed to compile wasm module: ' + e);
      if (e.toString().indexOf('imported Memory with incompatible size') >= 0) {
        Module['printErr']('Memory size incompatibility issues may be due to changing TOTAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set TOTAL_MEMORY at runtime to something smaller than it was at compile time).');
      }
      return false;
    }
    exports = instance.exports;
    if (exports.memory) mergeMemory(exports.memory);

    Module["usingWasm"] = true;

    return exports;
  }

  function doWasmPolyfill(global, env, providedBuffer, method) {
    if (typeof WasmJS !== 'function') {
      Module['printErr']('WasmJS not detected - polyfill not bundled?');
      return false;
    }

    // Use wasm.js to polyfill and execute code in a wasm interpreter.
    var wasmJS = WasmJS({});

    // XXX don't be confused. Module here is in the outside program. wasmJS is the inner wasm-js.cpp.
    wasmJS['outside'] = Module; // Inside wasm-js.cpp, Module['outside'] reaches the outside module.

    // Information for the instance of the module.
    wasmJS['info'] = info;

    wasmJS['lookupImport'] = lookupImport;

    assert(providedBuffer === Module['buffer']); // we should not even need to pass it as a 3rd arg for wasm, but that's the asm.js way.

    info.global = global;
    info.env = env;

    // polyfill interpreter expects an ArrayBuffer
    assert(providedBuffer === Module['buffer']);
    env['memory'] = providedBuffer;
    assert(env['memory'] instanceof ArrayBuffer);

    wasmJS['providedTotalMemory'] = Module['buffer'].byteLength;

    // Prepare to generate wasm, using either asm2wasm or s-exprs
    var code;
    if (method === 'interpret-binary') {
      code = getBinary();
    } else {
      code = Module['read'](method == 'interpret-asm2wasm' ? asmjsCodeFile : wasmTextFile);
    }
    var temp;
    if (method == 'interpret-asm2wasm') {
      temp = wasmJS['_malloc'](code.length + 1);
      wasmJS['writeAsciiToMemory'](code, temp);
      wasmJS['_load_asm2wasm'](temp);
    } else if (method === 'interpret-s-expr') {
      temp = wasmJS['_malloc'](code.length + 1);
      wasmJS['writeAsciiToMemory'](code, temp);
      wasmJS['_load_s_expr2wasm'](temp);
    } else if (method === 'interpret-binary') {
      temp = wasmJS['_malloc'](code.length);
      wasmJS['HEAPU8'].set(code, temp);
      wasmJS['_load_binary2wasm'](temp, code.length);
    } else {
      throw 'what? ' + method;
    }
    wasmJS['_free'](temp);

    wasmJS['_instantiate'](temp);

    if (Module['newBuffer']) {
      mergeMemory(Module['newBuffer']);
      Module['newBuffer'] = null;
    }

    exports = wasmJS['asmExports'];

    return exports;
  }

  // We may have a preloaded value in Module.asm, save it
  Module['asmPreload'] = Module['asm'];

  // Memory growth integration code
  Module['reallocBuffer'] = function(size) {
    size = Math.ceil(size / wasmPageSize) * wasmPageSize; // round up to wasm page size
    var old = Module['buffer'];
    var result = exports['__growWasmMemory'](size / wasmPageSize); // tiny wasm method that just does grow_memory
    if (Module["usingWasm"]) {
      if (result !== (-1 | 0)) {
        // success in native wasm memory growth, get the buffer from the memory
        return Module['buffer'] = Module['wasmMemory'].buffer;
      } else {
        return null;
      }
    } else {
      // in interpreter, we replace Module.buffer if we allocate
      return Module['buffer'] !== old ? Module['buffer'] : null; // if it was reallocated, it changed
    }
  };

  // Provide an "asm.js function" for the application, called to "link" the asm.js module. We instantiate
  // the wasm module at that time, and it receives imports and provides exports and so forth, the app
  // doesn't need to care that it is wasm or olyfilled wasm or asm.js.

  Module['asm'] = function(global, env, providedBuffer) {
    global = fixImports(global);
    env = fixImports(env);

    // import table
    if (!env['table']) {
      var TABLE_SIZE = Module['wasmTableSize'];
      if (TABLE_SIZE === undefined) TABLE_SIZE = 1024; // works in binaryen interpreter at least
      var MAX_TABLE_SIZE = Module['wasmMaxTableSize'];
      if (typeof WebAssembly === 'object' && typeof WebAssembly.Table === 'function') {
        if (MAX_TABLE_SIZE !== undefined) {
          env['table'] = new WebAssembly.Table({ initial: TABLE_SIZE, maximum: MAX_TABLE_SIZE, element: 'anyfunc' });
        } else {
          env['table'] = new WebAssembly.Table({ initial: TABLE_SIZE, element: 'anyfunc' });
        }
      } else {
        env['table'] = new Array(TABLE_SIZE); // works in binaryen interpreter at least
      }
      Module['wasmTable'] = env['table'];
    }

    if (!env['memoryBase']) {
      env['memoryBase'] = Module['STATIC_BASE']; // tell the memory segments where to place themselves
    }
    if (!env['tableBase']) {
      env['tableBase'] = 0; // table starts at 0 by default, in dynamic linking this will change
    }
    
    // try the methods. each should return the exports if it succeeded

    var exports;
    var methods = method.split(',');

    for (var i = 0; i < methods.length; i++) {
      var curr = methods[i];

      Module['printErr']('trying binaryen method: ' + curr);

      if (curr === 'native-wasm') {
        if (exports = doNativeWasm(global, env, providedBuffer)) break;
      } else if (curr === 'asmjs') {
        if (exports = doJustAsm(global, env, providedBuffer)) break;
      } else if (curr === 'interpret-asm2wasm' || curr === 'interpret-s-expr' || curr === 'interpret-binary') {
        if (exports = doWasmPolyfill(global, env, providedBuffer, curr)) break;
      } else {
        throw 'bad method: ' + curr;
      }
    }

    if (!exports) throw 'no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods';

    Module['printErr']('binaryen method succeeded.');

    return exports;
  };

  var methodHandler = Module['asm']; // note our method handler, as we may modify Module['asm'] later
}


integrateWasmJS(Module);

// {{PREAMBLE_ADDITIONS}}

// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  setTempRet0: function (value) {
    tempRet0 = value;
  },
  getTempRet0: function () {
    return tempRet0;
  },
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  STACK_ALIGN: 16,
  prepVararg: function (ptr, type) {
    if (type === 'double' || type === 'i64') {
      // move so the load is aligned
      if (ptr & 7) {
        assert((ptr & 7) === 4);
        ptr += 4;
      }
    } else {
      assert((ptr & 3) === 0);
    }
    return ptr;
  },
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[sig]) {
      Runtime.funcWrappers[sig] = {};
    }
    var sigCache = Runtime.funcWrappers[sig];
    if (!sigCache[func]) {
      // optimize away arguments usage in common cases
      if (sig.length === 1) {
        sigCache[func] = function dynCall_wrapper() {
          return Runtime.dynCall(sig, func);
        };
      } else if (sig.length === 2) {
        sigCache[func] = function dynCall_wrapper(arg) {
          return Runtime.dynCall(sig, func, [arg]);
        };
      } else {
        // general case
        sigCache[func] = function dynCall_wrapper() {
          return Runtime.dynCall(sig, func, Array.prototype.slice.call(arguments));
        };
      }
    }
    return sigCache[func];
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+15)&-16); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+15)&-16); return ret; },
  dynamicAlloc: function (size) { var ret = HEAP32[DYNAMICTOP_PTR>>2];var end = (((ret + size + 15)|0) & -16);HEAP32[DYNAMICTOP_PTR>>2] = end;if (end >= TOTAL_MEMORY) {var success = enlargeMemory();if (!success) {HEAP32[DYNAMICTOP_PTR>>2] = ret;return 0;}}return ret;},
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 16))*(quantum ? quantum : 16); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0))); return ret; },
  GLOBAL_BASE: 1024,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}



Module["Runtime"] = Runtime;



//========================================
// Runtime essentials
//========================================

var ABORT = 0; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  if (!func) {
    try { func = eval('_' + ident); } catch(e) {}
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

var cwrap, ccall;
(function(){
  var JSfuncs = {
    // Helpers for cwrap -- it can't refer to Runtime directly because it might
    // be renamed by closure, instead it calls JSfuncs['stackSave'].body to find
    // out what the minified function name is.
    'stackSave': function() {
      Runtime.stackSave()
    },
    'stackRestore': function() {
      Runtime.stackRestore()
    },
    // type conversion from js to c
    'arrayToC' : function(arr) {
      var ret = Runtime.stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    },
    'stringToC' : function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = Runtime.stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    }
  };
  // For fast lookup of conversion functions
  var toC = {'string' : JSfuncs['stringToC'], 'array' : JSfuncs['arrayToC']};

  // C calling interface.
  ccall = function ccallFunc(ident, returnType, argTypes, args, opts) {
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
      for (var i = 0; i < args.length; i++) {
        var converter = toC[argTypes[i]];
        if (converter) {
          if (stack === 0) stack = Runtime.stackSave();
          cArgs[i] = converter(args[i]);
        } else {
          cArgs[i] = args[i];
        }
      }
    }
    var ret = func.apply(null, cArgs);
    if (returnType === 'string') ret = Pointer_stringify(ret);
    if (stack !== 0) {
      if (opts && opts.async) {
        EmterpreterAsync.asyncFinalizers.push(function() {
          Runtime.stackRestore(stack);
        });
        return;
      }
      Runtime.stackRestore(stack);
    }
    return ret;
  }

  var sourceRegex = /^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;
  function parseJSFunc(jsfunc) {
    // Match the body and the return value of a javascript function source
    var parsed = jsfunc.toString().match(sourceRegex).slice(1);
    return {arguments : parsed[0], body : parsed[1], returnValue: parsed[2]}
  }

  // sources of useful functions. we create this lazily as it can trigger a source decompression on this entire file
  var JSsource = null;
  function ensureJSsource() {
    if (!JSsource) {
      JSsource = {};
      for (var fun in JSfuncs) {
        if (JSfuncs.hasOwnProperty(fun)) {
          // Elements of toCsource are arrays of three items:
          // the code, and the return value
          JSsource[fun] = parseJSFunc(JSfuncs[fun]);
        }
      }
    }
  }

  cwrap = function cwrap(ident, returnType, argTypes) {
    argTypes = argTypes || [];
    var cfunc = getCFunc(ident);
    // When the function takes numbers and returns a number, we can just return
    // the original function
    var numericArgs = argTypes.every(function(type){ return type === 'number'});
    var numericRet = (returnType !== 'string');
    if ( numericRet && numericArgs) {
      return cfunc;
    }
    // Creation of the arguments list (["$1","$2",...,"$nargs"])
    var argNames = argTypes.map(function(x,i){return '$'+i});
    var funcstr = "(function(" + argNames.join(',') + ") {";
    var nargs = argTypes.length;
    if (!numericArgs) {
      // Generate the code needed to convert the arguments from javascript
      // values to pointers
      ensureJSsource();
      funcstr += 'var stack = ' + JSsource['stackSave'].body + ';';
      for (var i = 0; i < nargs; i++) {
        var arg = argNames[i], type = argTypes[i];
        if (type === 'number') continue;
        var convertCode = JSsource[type + 'ToC']; // [code, return]
        funcstr += 'var ' + convertCode.arguments + ' = ' + arg + ';';
        funcstr += convertCode.body + ';';
        funcstr += arg + '=(' + convertCode.returnValue + ');';
      }
    }

    // When the code is compressed, the name of cfunc is not literally 'cfunc' anymore
    var cfuncname = parseJSFunc(function(){return cfunc}).returnValue;
    // Call the function
    funcstr += 'var ret = ' + cfuncname + '(' + argNames.join(',') + ');';
    if (!numericRet) { // Return type can only by 'string' or 'number'
      // Convert the result to a string
      var strgfy = parseJSFunc(function(){return Pointer_stringify}).returnValue;
      funcstr += 'ret = ' + strgfy + '(ret);';
    }
    if (!numericArgs) {
      // If we had a stack, restore it
      ensureJSsource();
      funcstr += JSsource['stackRestore'].body.replace('()', '(stack)') + ';';
    }
    funcstr += 'return ret})';
    return eval(funcstr);
  };
})();
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;

function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module["setValue"] = setValue;


function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module["getValue"] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module["ALLOC_NORMAL"] = ALLOC_NORMAL;
Module["ALLOC_STACK"] = ALLOC_STACK;
Module["ALLOC_STATIC"] = ALLOC_STATIC;
Module["ALLOC_DYNAMIC"] = ALLOC_DYNAMIC;
Module["ALLOC_NONE"] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [typeof _malloc === 'function' ? _malloc : Runtime.staticAlloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module["allocate"] = allocate;

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!staticSealed) return Runtime.staticAlloc(size);
  if (!runtimeInitialized) return Runtime.dynamicAlloc(size);
  return _malloc(size);
}
Module["getMemory"] = getMemory;

function Pointer_stringify(ptr, /* optional */ length) {
  if (length === 0 || !ptr) return '';
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = 0;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))>>0)];
    hasUtf |= t;
    if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (hasUtf < 128) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }
  return Module['UTF8ToString'](ptr);
}
Module["Pointer_stringify"] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAP8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}
Module["AsciiToString"] = AsciiToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}
Module["stringToAscii"] = stringToAscii;

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;
function UTF8ArrayToString(u8Array, idx) {
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  while (u8Array[endPtr]) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var u0, u1, u2, u3, u4, u5;

    var str = '';
    while (1) {
      // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
      u0 = u8Array[idx++];
      if (!u0) return str;
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u3 = u8Array[idx++] & 63;
        if ((u0 & 0xF8) == 0xF0) {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
        } else {
          u4 = u8Array[idx++] & 63;
          if ((u0 & 0xFC) == 0xF8) {
            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
          } else {
            u5 = u8Array[idx++] & 63;
            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
          }
        }
      }
      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
}
Module["UTF8ArrayToString"] = UTF8ArrayToString;

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function UTF8ToString(ptr) {
  return UTF8ArrayToString(HEAPU8,ptr);
}
Module["UTF8ToString"] = UTF8ToString;

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x1FFFFF) {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0x3FFFFFF) {
      if (outIdx + 4 >= endIdx) break;
      outU8Array[outIdx++] = 0xF8 | (u >> 24);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 5 >= endIdx) break;
      outU8Array[outIdx++] = 0xFC | (u >> 30);
      outU8Array[outIdx++] = 0x80 | ((u >> 24) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 18) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}
Module["stringToUTF8Array"] = stringToUTF8Array;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}
Module["stringToUTF8"] = stringToUTF8;

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) {
      ++len;
    } else if (u <= 0x7FF) {
      len += 2;
    } else if (u <= 0xFFFF) {
      len += 3;
    } else if (u <= 0x1FFFFF) {
      len += 4;
    } else if (u <= 0x3FFFFFF) {
      len += 5;
    } else {
      len += 6;
    }
  }
  return len;
}
Module["lengthBytesUTF8"] = lengthBytesUTF8;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}


// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}


// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}


function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}


// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}


// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}


function demangle(func) {
  var __cxa_demangle_func = Module['___cxa_demangle'] || Module['__cxa_demangle'];
  if (__cxa_demangle_func) {
    try {
      var s =
        func.substr(1);
      var len = lengthBytesUTF8(s)+1;
      var buf = _malloc(len);
      stringToUTF8(s, buf, len);
      var status = _malloc(4);
      var ret = __cxa_demangle_func(buf, 0, 0, status);
      if (getValue(status, 'i32') === 0 && ret) {
        return Pointer_stringify(ret);
      }
      // otherwise, libcxxabi failed
    } catch(e) {
      // ignore problems here
    } finally {
      if (buf) _free(buf);
      if (status) _free(status);
      if (ret) _free(ret);
    }
    // failure when using libcxxabi, don't demangle
    return func;
  }
  Runtime.warnOnce('warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling');
  return func;
}

function demangleAll(text) {
  var regex =
    /__Z[\w\d_]+/g;
  return text.replace(regex,
    function(x) {
      var y = demangle(x);
      return x === y ? x : (x + ' [' + y + ']');
    });
}

function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
    // so try that as a special-case.
    try {
      throw new Error(0);
    } catch(e) {
      err = e;
    }
    if (!err.stack) {
      return '(no stack trace available)';
    }
  }
  return err.stack.toString();
}

function stackTrace() {
  var js = jsStackTrace();
  if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
  return demangleAll(js);
}
Module["stackTrace"] = stackTrace;

// Memory management

var PAGE_SIZE = 4096;

function alignMemoryPage(x) {
  if (x % 4096 > 0) {
    x += (4096 - (x % 4096));
  }
  return x;
}

var HEAP;
var buffer;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBuffer(buf) {
  Module['buffer'] = buffer = buf;
}

function updateGlobalBufferViews() {
  Module['HEAP8'] = HEAP8 = new Int8Array(buffer);
  Module['HEAP16'] = HEAP16 = new Int16Array(buffer);
  Module['HEAP32'] = HEAP32 = new Int32Array(buffer);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buffer);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buffer);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buffer);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buffer);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buffer);
}

var STATIC_BASE, STATICTOP, staticSealed; // static area
var STACK_BASE, STACKTOP, STACK_MAX; // stack area
var DYNAMIC_BASE, DYNAMICTOP_PTR; // dynamic area handled by sbrk

  STATIC_BASE = STATICTOP = STACK_BASE = STACKTOP = STACK_MAX = DYNAMIC_BASE = DYNAMICTOP_PTR = 0;
  staticSealed = false;



function abortOnCannotGrowMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ');
}

if (!Module['reallocBuffer']) Module['reallocBuffer'] = function(size) {
  var ret;
  try {
    if (ArrayBuffer.transfer) {
      ret = ArrayBuffer.transfer(buffer, size);
    } else {
      var oldHEAP8 = HEAP8;
      ret = new ArrayBuffer(size);
      var temp = new Int8Array(ret);
      temp.set(oldHEAP8);
    }
  } catch(e) {
    return false;
  }
  var success = _emscripten_replace_memory(ret);
  if (!success) return false;
  return ret;
};

function enlargeMemory() {
  // TOTAL_MEMORY is the current size of the actual array, and DYNAMICTOP is the new top.

  var OLD_TOTAL_MEMORY = TOTAL_MEMORY;


  var LIMIT = Math.pow(2, 31); // 2GB is a practical maximum, as we use signed ints as pointers
                               // and JS engines seem unhappy to give us 2GB arrays currently
  if (HEAP32[DYNAMICTOP_PTR>>2] >= LIMIT) return false;

  while (TOTAL_MEMORY < HEAP32[DYNAMICTOP_PTR>>2]) { // Keep incrementing the heap size as long as it's less than what is requested.
    if (TOTAL_MEMORY < LIMIT/2) {
      TOTAL_MEMORY = alignMemoryPage(2*TOTAL_MEMORY); // // Simple heuristic: double until 1GB...
    } else {
      var last = TOTAL_MEMORY;
      TOTAL_MEMORY = alignMemoryPage((3*TOTAL_MEMORY + LIMIT)/4); // ..., but after that, add smaller increments towards 2GB, which we cannot reach
      if (TOTAL_MEMORY <= last) return false;
    }
  }

  TOTAL_MEMORY = Math.max(TOTAL_MEMORY, 16*1024*1024);

  if (TOTAL_MEMORY >= LIMIT) return false;




  var replacement = Module['reallocBuffer'](TOTAL_MEMORY);
  if (!replacement) return false;

  // everything worked

  updateGlobalBuffer(replacement);
  updateGlobalBufferViews();


  return true;
}

var byteLength;
try {
  byteLength = Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, 'byteLength').get);
  byteLength(new ArrayBuffer(4)); // can fail on older ie
} catch(e) { // can fail on older node/v8
  byteLength = function(buffer) { return buffer.byteLength; };
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;

var WASM_PAGE_SIZE = 64 * 1024;

var totalMemory = WASM_PAGE_SIZE;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024;
  }
}
totalMemory = Math.max(totalMemory, 16*1024*1024);
if (totalMemory !== TOTAL_MEMORY) {
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory



// Use a provided buffer, if there is one, or else allocate a new one
if (Module['buffer']) {
  buffer = Module['buffer'];
} else {
  // Use a WebAssembly memory where available
  if (typeof WebAssembly === 'object' && typeof WebAssembly.Memory === 'function') {
    Module['wasmMemory'] = new WebAssembly.Memory({ initial: TOTAL_MEMORY / WASM_PAGE_SIZE });
    buffer = Module['wasmMemory'].buffer;
  } else
  {
    buffer = new ArrayBuffer(TOTAL_MEMORY);
  }
}
updateGlobalBufferViews();


function getTotalMemory() {
  return TOTAL_MEMORY;
}

// Endianness check (note: assumes compiler arch was little-endian)
  HEAP32[0] = 0x63736d65; /* 'emsc' */
HEAP16[1] = 0x6373;
if (HEAPU8[2] !== 0x73 || HEAPU8[3] !== 0x63) throw 'Runtime error: expected the system to be little-endian!';

Module['HEAP'] = HEAP;
Module['buffer'] = buffer;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
  runtimeExited = true;
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module["addOnPreRun"] = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module["addOnInit"] = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module["addOnPreMain"] = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module["addOnExit"] = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module["addOnPostRun"] = addOnPostRun;

// Tools


function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
Module["intArrayFromString"] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module["intArrayToString"] = intArrayToString;

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
function writeStringToMemory(string, buffer, dontAddNull) {
  Runtime.warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var lastChar, end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}
Module["writeStringToMemory"] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
Module["writeArrayToMemory"] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}
Module["writeAsciiToMemory"] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}


// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];

if (!Math['fround']) {
  var froundBuffer = new Float32Array(1);
  Math['fround'] = function(x) { froundBuffer[0] = x; return froundBuffer[0] };
}
Math.fround = Math['fround'];

if (!Math['clz32']) Math['clz32'] = function(x) {
  x = x >>> 0;
  for (var i = 0; i < 32; i++) {
    if (x & (1 << (31 - i))) return i;
  }
  return 32;
};
Math.clz32 = Math['clz32']

if (!Math['trunc']) Math['trunc'] = function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};
Math.trunc = Math['trunc'];

var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module["addRunDependency"] = addRunDependency;

function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module["removeRunDependency"] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data



var memoryInitializer = null;





// === Body ===

var ASM_CONSTS = [];




STATIC_BASE = 1024;

STATICTOP = STATIC_BASE + 592640;
  /* global initializers */  __ATINIT__.push({ func: function() { __GLOBAL__I_000101() } }, { func: function() { __Z7my_loadv() } }, { func: function() { __GLOBAL__sub_I_ShaderManager_cpp() } }, { func: function() { __GLOBAL__sub_I_GlTextureManager_cpp() } }, { func: function() { __GLOBAL__sub_I_Glyph_cpp() } }, { func: function() { __GLOBAL__sub_I_GlyphsManager_cpp() } }, { func: function() { __GLOBAL__sub_I_GlyphsRenderer_cpp() } }, { func: function() { __GLOBAL__sub_I_CircleGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_TriangleGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_FontIconGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_ConcaveHullBuilder_cpp() } }, { func: function() { __GLOBAL__sub_I_TulipToOGDF_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFLayoutPluginBase_cpp() } }, { func: function() { __GLOBAL__sub_I_CoinParamUtils_cpp() } }, { func: function() { __GLOBAL__sub_I_unitTest_cpp() } }, { func: function() { __GLOBAL__sub_I_OsiNames_cpp() } }, { func: function() { __GLOBAL__sub_I_CglLandPValidator_cpp() } }, { func: function() { __GLOBAL__sub_I_LabelsRenderer_cpp() } }, { func: function() { __GLOBAL__sub_I_Logger_cpp() } }, { func: function() { __GLOBAL__sub_I_LayoutStandards_cpp() } }, { func: function() { __GLOBAL__sub_I_config_cpp() } }, { func: function() { __GLOBAL__sub_I_Ogml_cpp() } }, { func: function() { __GLOBAL__sub_I_GraphIO_svg_cpp() } }, { func: function() { __GLOBAL__sub_I_Bfs_cpp() } }, { func: function() { ___cxx_global_var_init_21() } }, { func: function() { ___cxx_global_var_init_22() } }, { func: function() { __GLOBAL__sub_I_BooleanProperty_cpp() } }, { func: function() { __GLOBAL__sub_I_ColorProperty_cpp() } }, { func: function() { __GLOBAL__sub_I_DataSet_cpp() } }, { func: function() { __GLOBAL__sub_I_Delaunay_cpp() } }, { func: function() { __GLOBAL__sub_I_DoubleProperty_cpp() } }, { func: function() { __GLOBAL__sub_I_Triconnected_cpp() } }, { func: function() { __GLOBAL__sub_I_SpanningDagSelection_cpp() } }, { func: function() { __GLOBAL__sub_I_ReachableSubGraphSelection_cpp() } }, { func: function() { __GLOBAL__sub_I_SpanningTreeSelection_cpp() } }, { func: function() { __GLOBAL__sub_I_InducedSubGraphSelection_cpp() } }, { func: function() { __GLOBAL__sub_I_LoopSelection_cpp() } }, { func: function() { __GLOBAL__sub_I_MultipleEdgeSelection_cpp() } }, { func: function() { __GLOBAL__sub_I_Kruskal_cpp() } }, { func: function() { __GLOBAL__sub_I_MetricMapping_cpp() } }, { func: function() { __GLOBAL__sub_I_AutoSize_cpp() } }, { func: function() { __GLOBAL__sub_I_Planarity_cpp() } }, { func: function() { __GLOBAL__sub_I_Simple_cpp() } }, { func: function() { __GLOBAL__sub_I_Tree_cpp() } }, { func: function() { __GLOBAL__sub_I_Connected_cpp() } }, { func: function() { __GLOBAL__sub_I_Biconnected_cpp() } }, { func: function() { __GLOBAL__sub_I_NanoVGManager_cpp() } }, { func: function() { __GLOBAL__sub_I_Outerplanar_cpp() } }, { func: function() { __GLOBAL__sub_I_Acyclic_cpp() } }, { func: function() { __GLOBAL__sub_I_ColorMapping_cpp() } }, { func: function() { __GLOBAL__sub_I_ToLabels_cpp() } }, { func: function() { __GLOBAL__sub_I_GlBuffer_cpp() } }, { func: function() { __GLOBAL__sub_I_GlCPULODCalculator_cpp() } }, { func: function() { __GLOBAL__sub_I_GlEntity_cpp() } }, { func: function() { __GLOBAL__sub_I_GlGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_GlGraphInputData_cpp() } }, { func: function() { __GLOBAL__sub_I_GlGraphStaticData_cpp() } }, { func: function() { __GLOBAL__sub_I_GlQuadTreeLODCalculator_cpp() } }, { func: function() { __GLOBAL__sub_I_GlScene_cpp() } }, { func: function() { __GLOBAL__sub_I_GlUtils_cpp() } }, { func: function() { __GLOBAL__sub_I_DrawingTools_cpp() } }, { func: function() { __GLOBAL__sub_I_WithParameter_cpp() } }, { func: function() { __GLOBAL__sub_I_PropertyTypes_cpp() } }, { func: function() { __GLOBAL__sub_I_SizeProperty_cpp() } }, { func: function() { __GLOBAL__sub_I_StlFunctions_cpp() } }, { func: function() { __GLOBAL__sub_I_StringProperty_cpp() } }, { func: function() { __GLOBAL__sub_I_TLPExport_cpp() } }, { func: function() { __GLOBAL__sub_I_TLPImport_cpp() } }, { func: function() { __GLOBAL__sub_I_TlpTools_cpp() } }, { func: function() { __GLOBAL__sub_I_TreeTest_cpp() } }, { func: function() { ___cxx_global_var_init_1380() } }, { func: function() { ___cxx_global_var_init_27() } }, { func: function() { ___cxx_global_var_init_29() } }, { func: function() { ___cxx_global_var_init_31() } }, { func: function() { ___cxx_global_var_init_33() } }, { func: function() { ___cxx_global_var_init_35() } }, { func: function() { __GLOBAL__sub_I_PropertyManager_cpp() } }, { func: function() { __GLOBAL__sub_I_TlpJsonExport_cpp() } }, { func: function() { __GLOBAL__sub_I_TlpJsonImport_cpp() } }, { func: function() { __GLOBAL__sub_I_TLPBExport_cpp() } }, { func: function() { __GLOBAL__sub_I_TLPBImport_cpp() } }, { func: function() { __GLOBAL__sub_I_TulipFontAwesome_cpp() } }, { func: function() { __GLOBAL__sub_I_TulipMaterialDesignIcons_cpp() } }, { func: function() { __GLOBAL__sub_I_DatasetTools_cpp() } }, { func: function() { __GLOBAL__sub_I_OrientableCoord_cpp() } }, { func: function() { __GLOBAL__sub_I_OrientableLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_OrientableSize_cpp() } }, { func: function() { __GLOBAL__sub_I_OrientableSizeProxy_cpp() } }, { func: function() { __GLOBAL__sub_I_Orientation_cpp() } }, { func: function() { __GLOBAL__sub_I_bind_cpp() } }, { func: function() { __GLOBAL__sub_I_iostream_cpp() } }, { func: function() { ___cxx_global_var_init_3_328() } }, { func: function() { __GLOBAL__sub_I_GraphAbstract_cpp() } }, { func: function() { __GLOBAL__sub_I_Graph_cpp() } }, { func: function() { ___cxx_global_var_init() } }, { func: function() { ___cxx_global_var_init_8() } }, { func: function() { ___cxx_global_var_init_1() } }, { func: function() { ___cxx_global_var_init_3() } }, { func: function() { ___cxx_global_var_init_5() } }, { func: function() { ___cxx_global_var_init_7() } }, { func: function() { ___cxx_global_var_init_9() } }, { func: function() { ___cxx_global_var_init_11() } }, { func: function() { __GLOBAL__sub_I_GraphMeasure_cpp() } }, { func: function() { __GLOBAL__sub_I_GraphProperty_cpp() } }, { func: function() { ___cxx_global_var_init_326() } }, { func: function() { ___cxx_global_var_init_1_327() } }, { func: function() { __GLOBAL__sub_I_WelshPowell_cpp() } }, { func: function() { ___cxx_global_var_init_5_329() } }, { func: function() { ___cxx_global_var_init_7_330() } }, { func: function() { ___cxx_global_var_init_9_331() } }, { func: function() { ___cxx_global_var_init_11_332() } }, { func: function() { __GLOBAL__sub_I_GraphTools_cpp() } }, { func: function() { __GLOBAL__sub_I_GraphView_cpp() } }, { func: function() { __GLOBAL__sub_I_IntegerProperty_cpp() } }, { func: function() { __GLOBAL__sub_I_LayoutProperty_cpp() } }, { func: function() { ___cxx_global_var_init_24() } }, { func: function() { ___cxx_global_var_init_25() } }, { func: function() { __GLOBAL__sub_I_Observable_cpp() } }, { func: function() { __GLOBAL__sub_I_ParametricCurves_cpp() } }, { func: function() { __GLOBAL__sub_I_PropertyAlgorithm_cpp() } }, { func: function() { __GLOBAL__sub_I_RandomTree_cpp() } }, { func: function() { __GLOBAL__sub_I_BendsTools_cpp() } }, { func: function() { __GLOBAL__sub_I_Dijkstra_cpp() } }, { func: function() { __GLOBAL__sub_I_EdgeBundling_cpp() } }, { func: function() { __GLOBAL__sub_I_OctreeBundle_cpp() } }, { func: function() { __GLOBAL__sub_I_QuadTree_cpp() } }, { func: function() { __GLOBAL__sub_I_SphereUtils_cpp() } }, { func: function() { __GLOBAL__sub_I_PlanarGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_dotImport_cpp() } }, { func: function() { __GLOBAL__sub_I_Grid_cpp() } }, { func: function() { __GLOBAL__sub_I_GMLImport_cpp() } }, { func: function() { __GLOBAL__sub_I_RandomGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_RandomSimpleGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_AdjacencyMatrixImport_cpp() } }, { func: function() { __GLOBAL__sub_I_CompleteGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_ReverseEdges_cpp() } }, { func: function() { __GLOBAL__sub_I_RandomTreeGeneral_cpp() } }, { func: function() { __GLOBAL__sub_I_CompleteTree_cpp() } }, { func: function() { __GLOBAL__sub_I_SmallWorldGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_ImportPajek_cpp() } }, { func: function() { __GLOBAL__sub_I_ImportUCINET_cpp() } }, { func: function() { __GLOBAL__sub_I_EmptyGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFFm3_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFUpwardPlanarization_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFFrutchermanReingold_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFFastMultipoleMultilevelEmbedder_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFFastMultipoleEmbedder_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFVisibility_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFKamadaKawai_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFCircular_cpp() } }, { func: function() { __GLOBAL__sub_I_HexagonGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_TulipBindings_cpp() } }, { func: function() { __GLOBAL__sub_I_main_cpp() } }, { func: function() { __GLOBAL__sub_I_FisheyeInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_LassoSelectionInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_NeighborhoodInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_RectangleZoomInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_SelectionInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_SelectionModifierInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_ZoomAndPanInteractor_cpp() } }, { func: function() { __GLOBAL__sub_I_ConeGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_CrossGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_CubeGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_CylinderGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_DiamondGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFBalloon_cpp() } }, { func: function() { __GLOBAL__sub_I_PentagonGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_RingGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_RoundedBoxGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_SphereGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_SquareGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_StarGlyph_cpp() } }, { func: function() { __GLOBAL__sub_I_DelaunayTriangulation_cpp() } }, { func: function() { __GLOBAL__sub_I_VoronoiDiagram_cpp() } }, { func: function() { __GLOBAL__sub_I_StrengthClustering_cpp() } }, { func: function() { __GLOBAL__sub_I_HierarchicalClustering_cpp() } }, { func: function() { __GLOBAL__sub_I_EqualValueClustering_cpp() } }, { func: function() { __GLOBAL__sub_I_QuotientClustering_cpp() } }, { func: function() { __GLOBAL__sub_I_GMLExport_cpp() } }, { func: function() { __GLOBAL__sub_I_CurveEdges_cpp() } }, { func: function() { __GLOBAL__sub_I_StrongComponent_cpp() } }, { func: function() { __GLOBAL__sub_I_Circular_cpp() } }, { func: function() { __GLOBAL__sub_I_HierarchicalGraph_cpp() } }, { func: function() { __GLOBAL__sub_I_Tutte_cpp() } }, { func: function() { __GLOBAL__sub_I_Dendrogram_cpp() } }, { func: function() { __GLOBAL__sub_I_ImprovedWalker_cpp() } }, { func: function() { __GLOBAL__sub_I_SquarifiedTreeMap_cpp() } }, { func: function() { __GLOBAL__sub_I_PerfectLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_PolyominoPacking_cpp() } }, { func: function() { __GLOBAL__sub_I_Eccentricity_cpp() } }, { func: function() { __GLOBAL__sub_I_DegreeMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_ClusterMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_StrengthMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_BiconnectedComponent_cpp() } }, { func: function() { __GLOBAL__sub_I_ConnectedComponent_cpp() } }, { func: function() { __GLOBAL__sub_I_BubbleTree_cpp() } }, { func: function() { __GLOBAL__sub_I_DagLevelMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_IdMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_LeafMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_NodeMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_DepthMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_PathLengthMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_StrahlerMetric_cpp() } }, { func: function() { __GLOBAL__sub_I_Random_cpp_4065() } }, { func: function() { __GLOBAL__sub_I_BetweennessCentrality_cpp() } }, { func: function() { __GLOBAL__sub_I_KCores_cpp() } }, { func: function() { __GLOBAL__sub_I_LouvainClustering_cpp() } }, { func: function() { __GLOBAL__sub_I_LinkCommunities_cpp() } }, { func: function() { __GLOBAL__sub_I_MCLClustering_cpp() } }, { func: function() { __GLOBAL__sub_I_PageRank_cpp() } }, { func: function() { __GLOBAL__sub_I_FastOverlapRemoval_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFDavidsonHarel_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFMMMExampleNoTwistLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFTree_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFMMMExampleFastLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFGemFrick_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFStressMajorization_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFSugiyama_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFDominance_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFMMMExampleNiceLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFPlanarizationGrid_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFBertaultLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFPivotMDS_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFTileToRowsPacking_cpp() } }, { func: function() { __GLOBAL__sub_I_OGDFPlanarizationLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_TulipHtml5_cpp() } }, { func: function() { __GLOBAL__sub_I_Grip_cpp() } }, { func: function() { __GLOBAL__sub_I_MISFiltering_cpp() } }, { func: function() { __GLOBAL__sub_I_Distances_cpp() } }, { func: function() { __GLOBAL__sub_I_LinLogLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_OctTree_cpp() } }, { func: function() { __GLOBAL__sub_I_LinLogAlgorithm_cpp() } }, { func: function() { __GLOBAL__sub_I_MixedModel_cpp() } }, { func: function() { __GLOBAL__sub_I_ConnectedComponentPacking_cpp() } }, { func: function() { __GLOBAL__sub_I_Random_cpp() } }, { func: function() { __GLOBAL__sub_I_GEMLayout_cpp() } }, { func: function() { __GLOBAL__sub_I_TreeReingoldAndTilfordExtended_cpp() } }, { func: function() { __GLOBAL__sub_I_ConeTreeExtended_cpp() } }, { func: function() { __GLOBAL__sub_I_TreeRadial_cpp() } }, { func: function() { __GLOBAL__sub_I_TreeLeaf_cpp() } });
  

memoryInitializer = Module["wasmJSMethod"].indexOf("asmjs") >= 0 || Module["wasmJSMethod"].indexOf("interpret-asm2wasm") >= 0 ? "tulip.js.mem" : null;




var STATIC_BUMP = 592640;
Module["STATIC_BASE"] = STATIC_BASE;
Module["STATIC_BUMP"] = STATIC_BUMP;

/* no memory initializer */
var tempDoublePtr = STATICTOP; STATICTOP += 16;

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}

// {{PRE_LIBRARY}}


  
  
  
  var GL={counter:1,lastError:0,buffers:[],mappedBuffers:{},programs:[],framebuffers:[],renderbuffers:[],textures:[],uniforms:[],shaders:[],vaos:[],contexts:[],currentContext:null,offscreenCanvases:{},timerQueriesEXT:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],programInfos:{},stringCache:{},packAlignment:4,unpackAlignment:4,init:function () {
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
          GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i+1);
        }
      },recordError:function recordError(errorCode) {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },getNewId:function (table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },MINI_TEMP_BUFFER_SIZE:256,miniTempBuffer:null,miniTempBufferViews:[0],getSource:function (shader, count, string, length) {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var frag;
          if (length) {
            var len = HEAP32[(((length)+(i*4))>>2)];
            if (len < 0) {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
            } else {
              frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)], len);
            }
          } else {
            frag = Pointer_stringify(HEAP32[(((string)+(i*4))>>2)]);
          }
          source += frag;
        }
        return source;
      },createContext:function (canvas, webGLContextAttributes) {
        if (typeof webGLContextAttributes['majorVersion'] === 'undefined' && typeof webGLContextAttributes['minorVersion'] === 'undefined') {
          webGLContextAttributes['majorVersion'] = 1;
          webGLContextAttributes['minorVersion'] = 0;
        }
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
          try {
            if (webGLContextAttributes['majorVersion'] == 1 && webGLContextAttributes['minorVersion'] == 0) {
              ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes);
            } else if (webGLContextAttributes['majorVersion'] == 2 && webGLContextAttributes['minorVersion'] == 0) {
              ctx = canvas.getContext("webgl2", webGLContextAttributes) || canvas.getContext("experimental-webgl2", webGLContextAttributes);
            } else {
              throw 'Unsupported WebGL context version ' + majorVersion + '.' + minorVersion + '!'
            }
          } finally {
            canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e, JSON.stringify(webGLContextAttributes)]);
          return 0;
        }
        // possible GL_DEBUG entry point: ctx = wrapDebugGL(ctx);
  
        if (!ctx) return 0;
        return GL.registerContext(ctx, webGLContextAttributes);
      },registerContext:function (ctx, webGLContextAttributes) {
        var handle = GL.getNewId(GL.contexts);
        var context = {
          handle: handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes['majorVersion'],
          GLctx: ctx
        };
        // Store the created context object so that we can access the context given a canvas without having to pass the parameters again.
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes['enableExtensionsByDefault'] === 'undefined' || webGLContextAttributes['enableExtensionsByDefault']) {
          GL.initExtensions(context);
        }
        return handle;
      },makeContextCurrent:function (contextHandle) {
        var context = GL.contexts[contextHandle];
        if (!context) return false;
        GLctx = Module.ctx = context.GLctx; // Active WebGL context object.
        GL.currentContext = context; // Active Emscripten GL layer context object.
        return true;
      },getContext:function (contextHandle) {
        return GL.contexts[contextHandle];
      },deleteContext:function (contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents === 'object') JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas); // Release all JS event handlers on the DOM element that the GL context is associated with since the context is now deleted.
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined; // Make sure the canvas object no longer refers to the context object so there are no GC surprises.
        GL.contexts[contextHandle] = null;
      },initExtensions:function (context) {
        // If this function is called without a specific context object, init the extensions of the currently active context.
        if (!context) context = GL.currentContext;
  
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
  
        var GLctx = context.GLctx;
  
        context.maxVertexAttribs = GLctx.getParameter(GLctx.MAX_VERTEX_ATTRIBS);
  
        // Detect the presence of a few extensions manually, this GL interop layer itself will need to know if they exist. 
  
        if (context.version < 2) {
          // Extension available from Firefox 26 and Google Chrome 30
          var instancedArraysExt = GLctx.getExtension('ANGLE_instanced_arrays');
          if (instancedArraysExt) {
            GLctx['vertexAttribDivisor'] = function(index, divisor) { instancedArraysExt['vertexAttribDivisorANGLE'](index, divisor); };
            GLctx['drawArraysInstanced'] = function(mode, first, count, primcount) { instancedArraysExt['drawArraysInstancedANGLE'](mode, first, count, primcount); };
            GLctx['drawElementsInstanced'] = function(mode, count, type, indices, primcount) { instancedArraysExt['drawElementsInstancedANGLE'](mode, count, type, indices, primcount); };
          }
  
          // Extension available from Firefox 25 and WebKit
          var vaoExt = GLctx.getExtension('OES_vertex_array_object');
          if (vaoExt) {
            GLctx['createVertexArray'] = function() { return vaoExt['createVertexArrayOES'](); };
            GLctx['deleteVertexArray'] = function(vao) { vaoExt['deleteVertexArrayOES'](vao); };
            GLctx['bindVertexArray'] = function(vao) { vaoExt['bindVertexArrayOES'](vao); };
            GLctx['isVertexArray'] = function(vao) { return vaoExt['isVertexArrayOES'](vao); };
          }
  
          var drawBuffersExt = GLctx.getExtension('WEBGL_draw_buffers');
          if (drawBuffersExt) {
            GLctx['drawBuffers'] = function(n, bufs) { drawBuffersExt['drawBuffersWEBGL'](n, bufs); };
          }
        }
  
        GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
  
        // These are the 'safe' feature-enabling extensions that don't add any performance impact related to e.g. debugging, and
        // should be enabled by default so that client GLES2/GL code will not need to go through extra hoops to get its stuff working.
        // As new extensions are ratified at http://www.khronos.org/registry/webgl/extensions/ , feel free to add your new extensions
        // here, as long as they don't produce a performance impact for users that might not be using those extensions.
        // E.g. debugging-related extensions should probably be off by default.
        var automaticallyEnabledExtensions = [ "OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives",
                                               "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture",
                                               "OES_element_index_uint", "EXT_texture_filter_anisotropic", "ANGLE_instanced_arrays",
                                               "OES_texture_float_linear", "OES_texture_half_float_linear", "WEBGL_compressed_texture_atc",
                                               "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float",
                                               "EXT_frag_depth", "EXT_sRGB", "WEBGL_draw_buffers", "WEBGL_shared_resources",
                                               "EXT_shader_texture_lod", "EXT_color_buffer_float"];
  
        function shouldEnableAutomatically(extension) {
          var ret = false;
          automaticallyEnabledExtensions.forEach(function(include) {
            if (ext.indexOf(include) != -1) {
              ret = true;
            }
          });
          return ret;
        }
  
        var exts = GLctx.getSupportedExtensions();
        if (exts && exts.length > 0) {
          GLctx.getSupportedExtensions().forEach(function(ext) {
            if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
              GLctx.getExtension(ext); // Calling .getExtension enables that extension permanently, no need to store the return value to be enabled.
            }
          });
        }
      },populateUniformTable:function (program) {
        var p = GL.programs[program];
        GL.programInfos[program] = {
          uniforms: {},
          maxUniformLength: 0, // This is eagerly computed below, since we already enumerate all uniforms anyway.
          maxAttributeLength: -1, // This is lazily computed and cached, computed when/if first asked, "-1" meaning not computed yet.
          maxUniformBlockNameLength: -1 // Lazily computed as well
        };
  
        var ptable = GL.programInfos[program];
        var utable = ptable.uniforms;
        // A program's uniform table maps the string name of an uniform to an integer location of that uniform.
        // The global GL.uniforms map maps integer locations to WebGLUniformLocations.
        var numUniforms = GLctx.getProgramParameter(p, GLctx.ACTIVE_UNIFORMS);
        for (var i = 0; i < numUniforms; ++i) {
          var u = GLctx.getActiveUniform(p, i);
  
          var name = u.name;
          ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length+1);
  
          // Strip off any trailing array specifier we might have got, e.g. "[0]".
          if (name.indexOf(']', name.length-1) !== -1) {
            var ls = name.lastIndexOf('[');
            name = name.slice(0, ls);
          }
  
          // Optimize memory usage slightly: If we have an array of uniforms, e.g. 'vec3 colors[3];', then 
          // only store the string 'colors' in utable, and 'colors[0]', 'colors[1]' and 'colors[2]' will be parsed as 'colors'+i.
          // Note that for the GL.uniforms table, we still need to fetch the all WebGLUniformLocations for all the indices.
          var loc = GLctx.getUniformLocation(p, name);
          var id = GL.getNewId(GL.uniforms);
          utable[name] = [u.size, id];
          GL.uniforms[id] = loc;
  
          for (var j = 1; j < u.size; ++j) {
            var n = name + '['+j+']';
            loc = GLctx.getUniformLocation(p, n);
            id = GL.getNewId(GL.uniforms);
  
            GL.uniforms[id] = loc;
          }
        }
      }};function _glGetString(name_) {
      if (GL.stringCache[name_]) return GL.stringCache[name_];
      var ret; 
      switch(name_) {
        case 0x1F00 /* GL_VENDOR */:
        case 0x1F01 /* GL_RENDERER */:
        case 0x9245 /* UNMASKED_VENDOR_WEBGL */:
        case 0x9246 /* UNMASKED_RENDERER_WEBGL */:
          ret = allocate(intArrayFromString(GLctx.getParameter(name_)), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F02 /* GL_VERSION */:
          var glVersion = GLctx.getParameter(GLctx.VERSION);
          // return GLES version string corresponding to the version of the WebGL context
          {
            glVersion = 'OpenGL ES 2.0 (' + glVersion + ')';
          }
          ret = allocate(intArrayFromString(glVersion), 'i8', ALLOC_NORMAL);
          break;
        case 0x1F03 /* GL_EXTENSIONS */:
          var exts = GLctx.getSupportedExtensions();
          var gl_exts = [];
          for (var i in exts) {
            gl_exts.push(exts[i]);
            gl_exts.push("GL_" + exts[i]);
          }
          ret = allocate(intArrayFromString(gl_exts.join(' ')), 'i8', ALLOC_NORMAL);
          break;
        case 0x8B8C /* GL_SHADING_LANGUAGE_VERSION */:
          var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
          // extract the version number 'N.M' from the string 'WebGL GLSL ES N.M ...'
          var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
          var ver_num = glslVersion.match(ver_re);
          if (ver_num !== null) {
            if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + '0'; // ensure minor version has 2 digits
            glslVersion = 'OpenGL ES GLSL ES ' + ver_num[1] + ' (' + glslVersion + ')';
          }
          ret = allocate(intArrayFromString(glslVersion), 'i8', ALLOC_NORMAL);
          break;
        default:
          GL.recordError(0x0500/*GL_INVALID_ENUM*/);
          return 0;
      }
      GL.stringCache[name_] = ret;
      return ret;
    }var GLEW={isLinaroFork:1,extensions:null,error:{0:null,1:null,2:null,3:null,4:null,5:null,6:null,7:null,8:null},version:{1:null,2:null,3:null,4:null},errorStringConstantFromCode:function (error) {
        if (GLEW.isLinaroFork) {
          switch (error) {
            case 4:return "OpenGL ES lib expected, found OpenGL lib"; // GLEW_ERROR_NOT_GLES_VERSION
            case 5:return "OpenGL lib expected, found OpenGL ES lib"; // GLEW_ERROR_GLES_VERSION
            case 6:return "Missing EGL version"; // GLEW_ERROR_NO_EGL_VERSION
            case 7:return "EGL 1.1 and up are supported"; // GLEW_ERROR_EGL_VERSION_10_ONLY
            default:break;
          }
        }
  
        switch (error) {
          case 0:return "No error"; // GLEW_OK || GLEW_NO_ERROR
          case 1:return "Missing GL version"; // GLEW_ERROR_NO_GL_VERSION
          case 2:return "GL 1.1 and up are supported"; // GLEW_ERROR_GL_VERSION_10_ONLY
          case 3:return "GLX 1.2 and up are supported"; // GLEW_ERROR_GLX_VERSION_11_ONLY
          default:return null;
        }
      },errorString:function (error) {
        if (!GLEW.error[error]) {
          var string = GLEW.errorStringConstantFromCode(error);
          if (!string) {
            string = "Unknown error";
            error = 8; // prevent array from growing more than this
          }
          GLEW.error[error] = allocate(intArrayFromString(string), 'i8', ALLOC_NORMAL);
        }
        return GLEW.error[error];
      },versionStringConstantFromCode:function (name) {
        switch (name) {
          case 1:return "1.10.0"; // GLEW_VERSION
          case 2:return "1"; // GLEW_VERSION_MAJOR
          case 3:return "10"; // GLEW_VERSION_MINOR
          case 4:return "0"; // GLEW_VERSION_MICRO
          default:return null;
        }
      },versionString:function (name) {
        if (!GLEW.version[name]) {
          var string = GLEW.versionStringConstantFromCode(name);
          if (!string)
            return 0;
          GLEW.version[name] = allocate(intArrayFromString(string), 'i8', ALLOC_NORMAL);
        }
        return GLEW.version[name];
      },extensionIsSupported:function (name) {
        if (!GLEW.extensions) {
          GLEW.extensions = Pointer_stringify(_glGetString(0x1F03)).split(' ');
        }
  
        if (GLEW.extensions.indexOf(name) != -1)
          return 1;
  
        // extensions from GLEmulations do not come unprefixed
        // so, try with prefix
        return (GLEW.extensions.indexOf("GL_" + name) != -1);
      }};function _glewInit() { return 0; }

  function _glClearColor(x0, x1, x2, x3) { GLctx['clearColor'](x0, x1, x2, x3) }

   
  Module["_pthread_mutex_lock"] = _pthread_mutex_lock;

  
  
  
  var emval_free_list=[];
  
  var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];
  
  
  function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
              ++count;
          }
      }
      return count;
    }
  
  function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
              return emval_handle_array[i];
          }
      }
      return null;
    }function init_emval() {
      Module['count_emval_handles'] = count_emval_handles;
      Module['get_first_emval'] = get_first_emval;
    }function __emval_register(value) {
  
      switch(value){
        case undefined :{ return 1; }
        case null :{ return 2; }
        case true :{ return 3; }
        case false :{ return 4; }
        default:{
          var handle = emval_free_list.length ?
              emval_free_list.pop() :
              emval_handle_array.length;
  
          emval_handle_array[handle] = {refcount: 1, value: value};
          return handle;
          }
        }
    }
  
  
  var registeredTypes={};
  
  
  function _free() {
  }
  Module["_free"] = _free;
  
  
  
  function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }var embind_charCodes=undefined;function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }
  
  
  
  
  
  
  var char_0=48;
  
  var char_9=57;function makeLegalFunctionName(name) {
      if (undefined === name) {
          return '_unknown';
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, '$');
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
          return '_' + name;
      } else {
          return name;
      }
    }function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      /*jshint evil:true*/
      return new Function(
          "body",
          "return function " + name + "() {\n" +
          "    \"use strict\";" +
          "    return body.apply(this, arguments);\n" +
          "};\n"
      )(body);
    }function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function(message) {
          this.name = errorName;
          this.message = message;
  
          var stack = (new Error(message)).stack;
          if (stack !== undefined) {
              this.stack = this.toString() + '\n' +
                  stack.replace(/^Error(:[^\n]*)?\n/, '');
          }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
          if (this.message === undefined) {
              return this.name;
          } else {
              return this.name + ': ' + this.message;
          }
      };
  
      return errorClass;
    }var BindingError=undefined;function throwBindingError(message) {
      throw new BindingError(message);
    }function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
          throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
      }
      return impl;
    }function craftEmvalAllocator(argCount) {
      /*This function returns a new function that looks like this:
      function emval_allocator_3(constructor, argTypes, args) {
          var argType0 = requireRegisteredType(HEAP32[(argTypes >> 2)], "parameter 0");
          var arg0 = argType0.readValueFromPointer(args);
          var argType1 = requireRegisteredType(HEAP32[(argTypes >> 2) + 1], "parameter 1");
          var arg1 = argType1.readValueFromPointer(args + 8);
          var argType2 = requireRegisteredType(HEAP32[(argTypes >> 2) + 2], "parameter 2");
          var arg2 = argType2.readValueFromPointer(args + 16);
          var obj = new constructor(arg0, arg1, arg2);
          return __emval_register(obj);
      } */
  
      var argsList = "";
      for(var i = 0; i < argCount; ++i) {
          argsList += (i!==0?", ":"")+"arg"+i; // 'arg0, arg1, ..., argn'
      }
  
      var functionBody =
          "return function emval_allocator_"+argCount+"(constructor, argTypes, args) {\n";
  
      for(var i = 0; i < argCount; ++i) {
          functionBody +=
              "var argType"+i+" = requireRegisteredType(HEAP32[(argTypes >> 2) + "+i+"], \"parameter "+i+"\");\n" +
              "var arg"+i+" = argType"+i+".readValueFromPointer(args);\n" +
              "args += argType"+i+"['argPackAdvance'];\n";
      }
      functionBody +=
          "var obj = new constructor("+argsList+");\n" +
          "return __emval_register(obj);\n" +
          "}\n";
  
      /*jshint evil:true*/
      return (new Function("requireRegisteredType", "HEAP32", "__emval_register", functionBody))(
          requireRegisteredType, HEAP32, __emval_register);
    }
  
  var emval_newers={};
  
  function requireHandle(handle) {
      if (!handle) {
          throwBindingError('Cannot use deleted val. handle = ' + handle);
      }
      return emval_handle_array[handle].value;
    }function __emval_new(handle, argCount, argTypes, args) {
      handle = requireHandle(handle);
  
      var newer = emval_newers[argCount];
      if (!newer) {
          newer = craftEmvalAllocator(argCount);
          emval_newers[argCount] = newer;
      }
  
      return newer(handle, argTypes, args);
    }

  
  
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  function ___setErrNo(value) {
      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
      return value;
    }
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          stream.tty.ops.flush(stream.tty);
        },flush:function (stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = new Buffer(BUFSIZE);
              var bytesRead = 0;
  
              var isPosixPlatform = (process.platform != 'win32'); // Node doesn't offer a direct check, so test by exclusion
  
              var fd = process.stdin.fd;
              if (isPosixPlatform) {
                // Linux and Mac cannot use process.stdin.fd (which isn't set up as sync)
                var usingDevice = false;
                try {
                  fd = fs.openSync('/dev/stdin', 'r');
                  usingDevice = true;
                } catch (e) {}
              }
  
              try {
                bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                else throw e;
              }
  
              if (usingDevice) { fs.closeSync(fd); }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
  
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },flush:function (tty) {
          if (tty.output && tty.output.length > 0) {
            Module['print'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function (tty) {
          if (tty.output && tty.output.length > 0) {
            Module['printErr'](UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function (node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function (node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function (node, newCapacity) {
        // If we are asked to expand the size of a file that already exists, revert to using a standard JS array to store the file
        // instead of a typed array. This makes resizing the array more flexible because we can just .push() elements at the back to
        // increase the size.
        if (node.contents && node.contents.subarray && newCapacity > node.contents.length) {
          node.contents = MEMFS.getFileDataAsRegularArray(node);
          node.usedBytes = node.contents.length; // We might be writing to a lazy-loaded file which had overridden this property, so force-reset it.
        }
  
        if (!node.contents || node.contents.subarray) { // Keep using a typed array if creating a new storage, or if old one was a typed array as well.
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
          // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
          // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
          // avoid overshooting the allocation cap by a very large margin.
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity); // Allocate new storage.
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
          return;
        }
        // Not using a typed array to back the file storage. Use a standard JS array instead.
        if (!node.contents && newCapacity > 0) node.contents = [];
        while (node.contents.length < newCapacity) node.contents.push(0);
      },resizeFileStorage:function (node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
          else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position+length);
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function (stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          if (mmapFlags & 2) {
            // MAP_PRIVATE calls need not to be synced back to underlying fs
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        if (typeof indexedDB !== 'undefined') return indexedDB;
        var ret = null;
        if (typeof window === 'object') ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, 'IDBFS used, but indexedDB not supported');
        return ret;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        if (!req) {
          return callback("Unable to connect to IndexedDB");
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          if (!fileStore.indexNames.contains('timestamp')) {
            fileStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function(e) {
            callback(this.error);
            e.preventDefault();
          };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          // Performance consideration: storing a normal JavaScript array to a IndexedDB is much slower than storing a typed array.
          // Therefore always convert the file contents to a typed array first before writing the data to IndexedDB.
          node.contents = MEMFS.getFileDataAsTypedArray(node);
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.chmod(path, entry.mode);
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function(e) {
          callback(this.error);
          e.preventDefault();
        };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function(e) {
          done(this.error);
          e.preventDefault();
        };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        flags &= ~0x200000 /*O_PATH*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x800 /*O_NONBLOCK*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x8000 /*O_LARGEFILE*/; // Ignore this flag from musl, otherwise node.js fails to open the file.
        flags &= ~0x80000 /*O_CLOEXEC*/; // Some applications may pass it; it makes no sense for a single process.
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            path = fs.readlinkSync(path);
            path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
            return path;
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          if (length === 0) return 0; // node errors on 0 length reads
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          return position;
        }}};
  
  var WORKERFS={DIR_MODE:16895,FILE_MODE:33279,reader:null,mount:function (mount) {
        assert(ENVIRONMENT_IS_WORKER);
        if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync();
        var root = WORKERFS.createNode(null, '/', WORKERFS.DIR_MODE, 0);
        var createdParents = {};
        function ensureParent(path) {
          // return the parent node, creating subdirs as necessary
          var parts = path.split('/');
          var parent = root;
          for (var i = 0; i < parts.length-1; i++) {
            var curr = parts.slice(0, i+1).join('/');
            // Issue 4254: Using curr as a node name will prevent the node
            // from being found in FS.nameTable when FS.open is called on
            // a path which holds a child of this node,
            // given that all FS functions assume node names
            // are just their corresponding parts within their given path,
            // rather than incremental aggregates which include their parent's
            // directories.
            if (!createdParents[curr]) {
              createdParents[curr] = WORKERFS.createNode(parent, parts[i], WORKERFS.DIR_MODE, 0);
            }
            parent = createdParents[curr];
          }
          return parent;
        }
        function base(path) {
          var parts = path.split('/');
          return parts[parts.length-1];
        }
        // We also accept FileList here, by using Array.prototype
        Array.prototype.forEach.call(mount.opts["files"] || [], function(file) {
          WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
        });
        (mount.opts["blobs"] || []).forEach(function(obj) {
          WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
        });
        (mount.opts["packages"] || []).forEach(function(pack) {
          pack['metadata'].files.forEach(function(file) {
            var name = file.filename.substr(1); // remove initial slash
            WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack['blob'].slice(file.start, file.end));
          });
        });
        return root;
      },createNode:function (parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = WORKERFS.node_ops;
        node.stream_ops = WORKERFS.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
        if (mode === WORKERFS.FILE_MODE) {
          node.size = contents.size;
          node.contents = contents;
        } else {
          node.size = 4096;
          node.contents = {};
        }
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          return {
            dev: 1,
            ino: undefined,
            mode: node.mode,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: undefined,
            size: node.size,
            atime: new Date(node.timestamp),
            mtime: new Date(node.timestamp),
            ctime: new Date(node.timestamp),
            blksize: 4096,
            blocks: Math.ceil(node.size / 4096),
          };
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rename:function (oldNode, newDir, newName) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },unlink:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rmdir:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readdir:function (node) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },symlink:function (parent, newName, oldPath) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readlink:function (node) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          if (position >= stream.node.size) return 0;
          var chunk = stream.node.contents.slice(position, position + length);
          var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
          buffer.set(new Uint8Array(ab), offset);
          return chunk.size;
        },write:function (stream, buffer, offset, length, position) {
          throw new FS.ErrnoError(ERRNO_CODES.EIO);
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.size;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        }}};
  
  var _stdin=STATICTOP; STATICTOP += 16;;
  
  var _stdout=STATICTOP; STATICTOP += 16;;
  
  var _stderr=STATICTOP; STATICTOP += 16;;
  
  var LZ4={DIR_MODE:16895,FILE_MODE:33279,CHUNK_SIZE:-1,codec:null,init:function () {
        if (LZ4.codec) return;
        LZ4.codec = (function() {
          /*
  MiniLZ4: Minimal LZ4 block decoding and encoding.
  
  based off of node-lz4, https://github.com/pierrec/node-lz4
  
  ====
  Copyright (c) 2012 Pierre Curto
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
  ====
  
  changes have the same license
  */
  
  var MiniLZ4 = (function() {
  
  var exports = {};
  
  /**
   * Decode a block. Assumptions: input contains all sequences of a 
   * chunk, output is large enough to receive the decoded data.
   * If the output buffer is too small, an error will be thrown.
   * If the returned value is negative, an error occured at the returned offset.
   *
   * @param input {Buffer} input data
   * @param output {Buffer} output data
   * @return {Number} number of decoded bytes
   * @private
   */
  exports.uncompress = function (input, output, sIdx, eIdx) {
  	sIdx = sIdx || 0
  	eIdx = eIdx || (input.length - sIdx)
  	// Process each sequence in the incoming data
  	for (var i = sIdx, n = eIdx, j = 0; i < n;) {
  		var token = input[i++]
  
  		// Literals
  		var literals_length = (token >> 4)
  		if (literals_length > 0) {
  			// length of literals
  			var l = literals_length + 240
  			while (l === 255) {
  				l = input[i++]
  				literals_length += l
  			}
  
  			// Copy the literals
  			var end = i + literals_length
  			while (i < end) output[j++] = input[i++]
  
  			// End of buffer?
  			if (i === n) return j
  		}
  
  		// Match copy
  		// 2 bytes offset (little endian)
  		var offset = input[i++] | (input[i++] << 8)
  
  		// XXX 0 is an invalid offset value
  		if (offset === 0) return j
  		if (offset > j) return -(i-2)
  
  		// length of match copy
  		var match_length = (token & 0xf)
  		var l = match_length + 240
  		while (l === 255) {
  			l = input[i++]
  			match_length += l
  		}
  
  		// Copy the match
  		var pos = j - offset // position of the match copy in the current output
  		var end = j + match_length + 4 // minmatch = 4
  		while (j < end) output[j++] = output[pos++]
  	}
  
  	return j
  }
  
  var
  	maxInputSize	= 0x7E000000
  ,	minMatch		= 4
  // uint32() optimization
  ,	hashLog			= 16
  ,	hashShift		= (minMatch * 8) - hashLog
  ,	hashSize		= 1 << hashLog
  
  ,	copyLength		= 8
  ,	lastLiterals	= 5
  ,	mfLimit			= copyLength + minMatch
  ,	skipStrength	= 6
  
  ,	mlBits  		= 4
  ,	mlMask  		= (1 << mlBits) - 1
  ,	runBits 		= 8 - mlBits
  ,	runMask 		= (1 << runBits) - 1
  
  ,	hasher 			= /* XXX uint32( */ 2654435761 /* ) */
  
  assert(hashShift === 16);
  var hashTable = new Int16Array(1<<16);
  var empty = new Int16Array(hashTable.length);
  
  // CompressBound returns the maximum length of a lz4 block, given it's uncompressed length
  exports.compressBound = function (isize) {
  	return isize > maxInputSize
  		? 0
  		: (isize + (isize/255) + 16) | 0
  }
  
  exports.compress = function (src, dst, sIdx, eIdx) {
  	hashTable.set(empty);
  	return compressBlock(src, dst, 0, sIdx || 0, eIdx || dst.length)
  }
  
  function compressBlock (src, dst, pos, sIdx, eIdx) {
  	// XXX var Hash = uint32() // Reusable unsigned 32 bits integer
  	var dpos = sIdx
  	var dlen = eIdx - sIdx
  	var anchor = 0
  
  	if (src.length >= maxInputSize) throw new Error("input too large")
  
  	// Minimum of input bytes for compression (LZ4 specs)
  	if (src.length > mfLimit) {
  		var n = exports.compressBound(src.length)
  		if ( dlen < n ) throw Error("output too small: " + dlen + " < " + n)
  
  		var 
  			step  = 1
  		,	findMatchAttempts = (1 << skipStrength) + 3
  		// Keep last few bytes incompressible (LZ4 specs):
  		// last 5 bytes must be literals
  		,	srcLength = src.length - mfLimit
  
  		while (pos + minMatch < srcLength) {
  			// Find a match
  			// min match of 4 bytes aka sequence
  			var sequenceLowBits = src[pos+1]<<8 | src[pos]
  			var sequenceHighBits = src[pos+3]<<8 | src[pos+2]
  			// compute hash for the current sequence
  			var hash = Math.imul(sequenceLowBits | (sequenceHighBits << 16), hasher) >>> hashShift;
  			/* XXX Hash.fromBits(sequenceLowBits, sequenceHighBits)
  							.multiply(hasher)
  							.shiftr(hashShift)
  							.toNumber() */
  			// get the position of the sequence matching the hash
  			// NB. since 2 different sequences may have the same hash
  			// it is double-checked below
  			// do -1 to distinguish between initialized and uninitialized values
  			var ref = hashTable[hash] - 1
  			// save position of current sequence in hash table
  			hashTable[hash] = pos + 1
  
  			// first reference or within 64k limit or current sequence !== hashed one: no match
  			if ( ref < 0 ||
  				((pos - ref) >>> 16) > 0 ||
  				(
  					((src[ref+3]<<8 | src[ref+2]) != sequenceHighBits) ||
  					((src[ref+1]<<8 | src[ref]) != sequenceLowBits )
  				)
  			) {
  				// increase step if nothing found within limit
  				step = findMatchAttempts++ >> skipStrength
  				pos += step
  				continue
  			}
  
  			findMatchAttempts = (1 << skipStrength) + 3
  
  			// got a match
  			var literals_length = pos - anchor
  			var offset = pos - ref
  
  			// minMatch already verified
  			pos += minMatch
  			ref += minMatch
  
  			// move to the end of the match (>=minMatch)
  			var match_length = pos
  			while (pos < srcLength && src[pos] == src[ref]) {
  				pos++
  				ref++
  			}
  
  			// match length
  			match_length = pos - match_length
  
  			// token
  			var token = match_length < mlMask ? match_length : mlMask
  
  			// encode literals length
  			if (literals_length >= runMask) {
  				// add match length to the token
  				dst[dpos++] = (runMask << mlBits) + token
  				for (var len = literals_length - runMask; len > 254; len -= 255) {
  					dst[dpos++] = 255
  				}
  				dst[dpos++] = len
  			} else {
  				// add match length to the token
  				dst[dpos++] = (literals_length << mlBits) + token
  			}
  
  			// write literals
  			for (var i = 0; i < literals_length; i++) {
  				dst[dpos++] = src[anchor+i]
  			}
  
  			// encode offset
  			dst[dpos++] = offset
  			dst[dpos++] = (offset >> 8)
  
  			// encode match length
  			if (match_length >= mlMask) {
  				match_length -= mlMask
  				while (match_length >= 255) {
  					match_length -= 255
  					dst[dpos++] = 255
  				}
  
  				dst[dpos++] = match_length
  			}
  
  			anchor = pos
  		}
  	}
  
  	// cannot compress input
  	if (anchor == 0) return 0
  
  	// Write last literals
  	// encode literals length
  	literals_length = src.length - anchor
  	if (literals_length >= runMask) {
  		// add match length to the token
  		dst[dpos++] = (runMask << mlBits)
  		for (var ln = literals_length - runMask; ln > 254; ln -= 255) {
  			dst[dpos++] = 255
  		}
  		dst[dpos++] = ln
  	} else {
  		// add match length to the token
  		dst[dpos++] = (literals_length << mlBits)
  	}
  
  	// write literals
  	pos = anchor
  	while (pos < src.length) {
  		dst[dpos++] = src[pos++]
  	}
  
  	return dpos
  }
  
  exports.CHUNK_SIZE = 2048; // musl libc does readaheads of 1024 bytes, so a multiple of that is a good idea
  
  exports.compressPackage = function(data, verify) {
    if (verify) {
      var temp = new Uint8Array(exports.CHUNK_SIZE);
    }
    // compress the data in chunks
    assert(data instanceof ArrayBuffer);
    data = new Uint8Array(data);
    console.log('compressing package of size ' + data.length);
    var compressedChunks = [];
    var successes = [];
    var offset = 0;
    var total = 0;
    while (offset < data.length) {
      var chunk = data.subarray(offset, offset + exports.CHUNK_SIZE);
      //console.log('compress a chunk ' + [offset, total, data.length]);
      offset += exports.CHUNK_SIZE;
      var bound = exports.compressBound(chunk.length);
      var compressed = new Uint8Array(bound);
      var compressedSize = exports.compress(chunk, compressed);
      if (compressedSize > 0) {
        assert(compressedSize <= bound);
        compressed = compressed.subarray(0, compressedSize);
        compressedChunks.push(compressed);
        total += compressedSize;
        successes.push(1);
        if (verify) {
          var back = exports.uncompress(compressed, temp);
          assert(back === chunk.length, [back, chunk.length]);
          for (var i = 0; i < chunk.length; i++) {
            assert(chunk[i] === temp[i]);
          }
        }
      } else {
        assert(compressedSize === 0);
        // failure to compress :(
        compressedChunks.push(chunk);
        total += chunk.length; // last chunk may not be the full exports.CHUNK_SIZE size
        successes.push(0);
      }
    }
    data = null; // XXX null out pack['data'] too?
    var compressedData = {
      data: new Uint8Array(total + exports.CHUNK_SIZE*2), // store all the compressed data, plus room for two cached decompressed chunk, in one fast array
      cachedOffset: total,
      cachedIndexes: [-1, -1], // cache last two blocks, so that reading 1,2,3 + preloading another block won't trigger decompress thrashing
      cachedChunks: [null, null],
      offsets: [], // chunk# => start in compressed data
      sizes: [],
      successes: successes, // 1 if chunk is compressed
    };
    offset = 0;
    for (var i = 0; i < compressedChunks.length; i++) {
      compressedData.data.set(compressedChunks[i], offset);
      compressedData.offsets[i] = offset;
      compressedData.sizes[i] = compressedChunks[i].length
      offset += compressedChunks[i].length;
    }
    console.log('compressed package into ' + [compressedData.data.length]);
    assert(offset === total);
    return compressedData;
  };
  
  assert(exports.CHUNK_SIZE < (1 << 15)); // we use 16-bit ints as the type of the hash table, chunk size must be smaller
  
  return exports;
  
  })();
  
  ;
          return MiniLZ4;
        })();
        LZ4.CHUNK_SIZE = LZ4.codec.CHUNK_SIZE;
      },loadPackage:function (pack) {
        LZ4.init();
        var compressedData = pack['compressedData'];
        if (!compressedData) compressedData = LZ4.codec.compressPackage(pack['data']);
        assert(compressedData.cachedIndexes.length === compressedData.cachedChunks.length);
        for (var i = 0; i < compressedData.cachedIndexes.length; i++) {
          compressedData.cachedIndexes[i] = -1;
          compressedData.cachedChunks[i] = compressedData.data.subarray(compressedData.cachedOffset + i*LZ4.CHUNK_SIZE,
                                                                        compressedData.cachedOffset + (i+1)*LZ4.CHUNK_SIZE);
          assert(compressedData.cachedChunks[i].length === LZ4.CHUNK_SIZE);
        }
        pack['metadata'].files.forEach(function(file) {
          var dir = PATH.dirname(file.filename);
          var name = PATH.basename(file.filename);
          FS.createPath('', dir, true, true);
          var parent = FS.analyzePath(dir).object;
          LZ4.createNode(parent, name, LZ4.FILE_MODE, 0, {
            compressedData: compressedData,
            start: file.start,
            end: file.end,
          });
        });
      },createNode:function (parent, name, mode, dev, contents, mtime) {
        var node = FS.createNode(parent, name, mode);
        node.mode = mode;
        node.node_ops = LZ4.node_ops;
        node.stream_ops = LZ4.stream_ops;
        node.timestamp = (mtime || new Date).getTime();
        assert(LZ4.FILE_MODE !== LZ4.DIR_MODE);
        if (mode === LZ4.FILE_MODE) {
          node.size = contents.end - contents.start;
          node.contents = contents;
        } else {
          node.size = 4096;
          node.contents = {};
        }
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },node_ops:{getattr:function (node) {
          return {
            dev: 1,
            ino: undefined,
            mode: node.mode,
            nlink: 1,
            uid: 0,
            gid: 0,
            rdev: undefined,
            size: node.size,
            atime: new Date(node.timestamp),
            mtime: new Date(node.timestamp),
            ctime: new Date(node.timestamp),
            blksize: 4096,
            blocks: Math.ceil(node.size / 4096),
          };
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
        },lookup:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        },mknod:function (parent, name, mode, dev) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rename:function (oldNode, newDir, newName) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },unlink:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },rmdir:function (parent, name) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readdir:function (node) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },symlink:function (parent, newName, oldPath) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        },readlink:function (node) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          //console.log('LZ4 read ' + [offset, length, position]);
          length = Math.min(length, stream.node.size - position);
          if (length <= 0) return 0;
          var contents = stream.node.contents;
          var compressedData = contents.compressedData;
          var written = 0;
          while (written < length) {
            var start = contents.start + position + written; // start index in uncompressed data
            var desired = length - written;
            //console.log('current read: ' + ['start', start, 'desired', desired]);
            var chunkIndex = Math.floor(start / LZ4.CHUNK_SIZE);
            var compressedStart = compressedData.offsets[chunkIndex];
            var compressedSize = compressedData.sizes[chunkIndex];
            var currChunk;
            if (compressedData.successes[chunkIndex]) {
              var found = compressedData.cachedIndexes.indexOf(chunkIndex);
              if (found >= 0) {
                currChunk = compressedData.cachedChunks[found];
              } else {
                // decompress the chunk
                compressedData.cachedIndexes.pop();
                compressedData.cachedIndexes.unshift(chunkIndex);
                currChunk = compressedData.cachedChunks.pop();
                compressedData.cachedChunks.unshift(currChunk);
                if (compressedData.debug) {
                  console.log('decompressing chunk ' + chunkIndex);
                  Module['decompressedChunks'] = (Module['decompressedChunks'] || 0) + 1;
                }
                var compressed = compressedData.data.subarray(compressedStart, compressedStart + compressedSize);
                //var t = Date.now();
                var originalSize = LZ4.codec.uncompress(compressed, currChunk);
                //console.log('decompress time: ' + (Date.now() - t));
                if (chunkIndex < compressedData.successes.length-1) assert(originalSize === LZ4.CHUNK_SIZE); // all but the last chunk must be full-size
              }
            } else {
              // uncompressed
              currChunk = compressedData.data.subarray(compressedStart, compressedStart + LZ4.CHUNK_SIZE);
            }
            var startInChunk = start % LZ4.CHUNK_SIZE;
            var endInChunk = Math.min(startInChunk + desired, LZ4.CHUNK_SIZE);
            buffer.set(currChunk.subarray(startInChunk, endInChunk), offset + written);
            var currWritten = endInChunk - startInChunk;
            written += currWritten;
          }
          return written;
        },write:function (stream, buffer, offset, length, position) {
          throw new FS.ErrnoError(ERRNO_CODES.EIO);
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.size;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return position;
        }}};var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); }
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); }
            }
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        var err = FS.nodePermissions(dir, 'x');
        if (err) return err;
        if (!dir.node_ops.lookup) return ERRNO_CODES.EACCES;
        return 0;
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          console.log('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(err) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(err);
        }
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:function (path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != ERRNO_CODES.EEXIST) throw e;
          }
        }
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        if (!PATH.resolve(oldpath)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return PATH.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function (stream) {
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          console.log("FS.trackingDelegate['onWriteToFile']('"+path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },msync:function (stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:function (stream) {
        return 0;
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function(stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto !== 'undefined') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else if (ENVIRONMENT_IS_NODE) {
          // for nodejs
          random_device = function() { return require('crypto').randomBytes(1)[0]; };
        } else {
          // default for ES5 platforms
          random_device = function() { return (Math.random()*256)|0; };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:function () {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: function() {
            var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: function(parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: function() { return stream.path } }
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          //Module.printErr(stackTrace()); // useful for debugging
          this.node = node;
          this.setErrno = function(errno) {
            this.errno = errno;
            for (var key in ERRNO_CODES) {
              if (ERRNO_CODES[key] === errno) {
                this.code = key;
                break;
              }
            }
          };
          this.setErrno(errno);
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
          'IDBFS': IDBFS,
          'NODEFS': NODEFS,
          'WORKERFS': WORKERFS,
        };
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        var fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        }
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        }
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        }
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init(); // XXX perhaps this method should move onto Browser?
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:function (dirfd, path) {
        if (path[0] !== '/') {
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
            dir = dirstream.path;
          }
          path = PATH.join2(dir, path);
        }
        return path;
      },doStat:function (func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -ERRNO_CODES.ENOTDIR;
          }
          throw e;
        }
        HEAP32[((buf)>>2)]=stat.dev;
        HEAP32[(((buf)+(4))>>2)]=0;
        HEAP32[(((buf)+(8))>>2)]=stat.ino;
        HEAP32[(((buf)+(12))>>2)]=stat.mode;
        HEAP32[(((buf)+(16))>>2)]=stat.nlink;
        HEAP32[(((buf)+(20))>>2)]=stat.uid;
        HEAP32[(((buf)+(24))>>2)]=stat.gid;
        HEAP32[(((buf)+(28))>>2)]=stat.rdev;
        HEAP32[(((buf)+(32))>>2)]=0;
        HEAP32[(((buf)+(36))>>2)]=stat.size;
        HEAP32[(((buf)+(40))>>2)]=4096;
        HEAP32[(((buf)+(44))>>2)]=stat.blocks;
        HEAP32[(((buf)+(48))>>2)]=(stat.atime.getTime() / 1000)|0;
        HEAP32[(((buf)+(52))>>2)]=0;
        HEAP32[(((buf)+(56))>>2)]=(stat.mtime.getTime() / 1000)|0;
        HEAP32[(((buf)+(60))>>2)]=0;
        HEAP32[(((buf)+(64))>>2)]=(stat.ctime.getTime() / 1000)|0;
        HEAP32[(((buf)+(68))>>2)]=0;
        HEAP32[(((buf)+(72))>>2)]=stat.ino;
        return 0;
      },doMsync:function (addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags);
      },doMkdir:function (path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
        FS.mkdir(path, mode, 0);
        return 0;
      },doMknod:function (path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default: return -ERRNO_CODES.EINVAL;
        }
        FS.mknod(path, mode, dev);
        return 0;
      },doReadlink:function (path, buf, bufsize) {
        if (bufsize <= 0) return -ERRNO_CODES.EINVAL;
        var ret = FS.readlink(path);
  
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf+len];
        stringToUTF8(ret, buf, bufsize+1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf+len] = endChar;
  
        return len;
      },doAccess:function (path, amode) {
        if (amode & ~7) {
          // need a valid mode
          return -ERRNO_CODES.EINVAL;
        }
        var node;
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
          return -ERRNO_CODES.EACCES;
        }
        return 0;
      },doDup:function (path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },doReadv:function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.read(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break; // nothing more to read
        }
        return ret;
      },doWritev:function (stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.write(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }
        return ret;
      },varargs:0,get:function (varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function () {
        var ret = Pointer_stringify(SYSCALLS.get());
        return ret;
      },getStreamFromFD:function () {
        var stream = FS.getStream(SYSCALLS.get());
        if (!stream) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return stream;
      },getSocketFromFD:function () {
        var socket = SOCKFS.getSocket(SYSCALLS.get());
        if (!socket) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        return socket;
      },getSocketAddress:function (allowNull) {
        var addrp = SYSCALLS.get(), addrlen = SYSCALLS.get();
        if (allowNull && addrp === 0) return null;
        var info = __read_sockaddr(addrp, addrlen);
        if (info.errno) throw new FS.ErrnoError(info.errno);
        info.addr = DNS.lookup_addr(info.addr) || info.addr;
        return info;
      },get64:function () {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        if (low >= 0) assert(high === 0);
        else assert(high === -1);
        return low;
      },getZero:function () {
        assert(SYSCALLS.get() === 0);
      }};function ___syscall195(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // SYS_stat64
      var path = SYSCALLS.getStr(), buf = SYSCALLS.get();
      return SYSCALLS.doStat(FS.stat, path, buf);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  function _malloc(bytes) {
      /* Over-allocate to make sure it is byte-aligned by 8.
       * This will leak memory, but this is only the dummy
       * implementation (replaced by dlmalloc normally) so
       * not an issue.
       */
      var ptr = Runtime.dynamicAlloc(bytes + 8);
      return (ptr+8) & 0xFFFFFFF8;
    }
  Module["_malloc"] = _malloc;
  
  
  var awaitingDependencies={};
  
  var typeDependencies={};
  
  
  
  var InternalError=undefined;function throwInternalError(message) {
      throw new InternalError(message);
    }function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
      myTypes.forEach(function(type) {
          typeDependencies[type] = dependentTypes;
      });
  
      function onComplete(typeConverters) {
          var myTypeConverters = getTypeConverters(typeConverters);
          if (myTypeConverters.length !== myTypes.length) {
              throwInternalError('Mismatched type converter count');
          }
          for (var i = 0; i < myTypes.length; ++i) {
              registerType(myTypes[i], myTypeConverters[i]);
          }
      }
  
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function(dt, i) {
          if (registeredTypes.hasOwnProperty(dt)) {
              typeConverters[i] = registeredTypes[dt];
          } else {
              unregisteredTypes.push(dt);
              if (!awaitingDependencies.hasOwnProperty(dt)) {
                  awaitingDependencies[dt] = [];
              }
              awaitingDependencies[dt].push(function() {
                  typeConverters[i] = registeredTypes[dt];
                  ++registered;
                  if (registered === unregisteredTypes.length) {
                      onComplete(typeConverters);
                  }
              });
          }
      });
      if (0 === unregisteredTypes.length) {
          onComplete(typeConverters);
      }
    }function registerType(rawType, registeredInstance, options) {
      options = options || {};
  
      if (!('argPackAdvance' in registeredInstance)) {
          throw new TypeError('registerType registeredInstance requires argPackAdvance');
      }
  
      var name = registeredInstance.name;
      if (!rawType) {
          throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
              return;
          } else {
              throwBindingError("Cannot register type '" + name + "' twice");
          }
      }
  
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
  
      if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach(function(cb) {
              cb();
          });
      }
    }
  
  function simpleReadValueFromPointer(pointer) {
      return this['fromWireType'](HEAPU32[pointer >> 2]);
    }function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              var length = HEAPU32[value >> 2];
              var a = new Array(length);
              for (var i = 0; i < length; ++i) {
                  a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
              }
              _free(value);
              return a.join('');
          },
          'toWireType': function(destructors, value) {
              if (value instanceof ArrayBuffer) {
                  value = new Uint8Array(value);
              }
  
              function getTAElement(ta, index) {
                  return ta[index];
              }
              function getStringElement(string, index) {
                  return string.charCodeAt(index);
              }
              var getElement;
              if (value instanceof Uint8Array) {
                  getElement = getTAElement;
              } else if (value instanceof Uint8ClampedArray) {
                  getElement = getTAElement;
              } else if (value instanceof Int8Array) {
                  getElement = getTAElement;
              } else if (typeof value === 'string') {
                  getElement = getStringElement;
              } else {
                  throwBindingError('Cannot pass non-string to std::string');
              }
  
              // assumes 4-byte alignment
              var length = value.length;
              var ptr = _malloc(4 + length);
              HEAPU32[ptr >> 2] = length;
              for (var i = 0; i < length; ++i) {
                  var charCode = getElement(value, i);
                  if (charCode > 255) {
                      _free(ptr);
                      throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                  }
                  HEAPU8[ptr + 4 + i] = charCode;
              }
              if (destructors !== null) {
                  destructors.push(_free, ptr);
              }
              return ptr;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: function(ptr) { _free(ptr); },
      });
    }

  function _glLinkProgram(program) {
      GLctx.linkProgram(GL.programs[program]);
      GL.programInfos[program] = null; // uniforms no longer keep the same names after linking
      GL.populateUniformTable(program);
    }

  function __embind_register_std_wstring(rawType, charSize, name) {
      // nb. do not cache HEAPU16 and HEAPU32, they may be destroyed by enlargeMemory().
      name = readLatin1String(name);
      var getHeap, shift;
      if (charSize === 2) {
          getHeap = function() { return HEAPU16; };
          shift = 1;
      } else if (charSize === 4) {
          getHeap = function() { return HEAPU32; };
          shift = 2;
      }
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              var HEAP = getHeap();
              var length = HEAPU32[value >> 2];
              var a = new Array(length);
              var start = (value + 4) >> shift;
              for (var i = 0; i < length; ++i) {
                  a[i] = String.fromCharCode(HEAP[start + i]);
              }
              _free(value);
              return a.join('');
          },
          'toWireType': function(destructors, value) {
              // assumes 4-byte alignment
              var HEAP = getHeap();
              var length = value.length;
              var ptr = _malloc(4 + length * charSize);
              HEAPU32[ptr >> 2] = length;
              var start = (ptr + 4) >> shift;
              for (var i = 0; i < length; ++i) {
                  HEAP[start + i] = value.charCodeAt(i);
              }
              if (destructors !== null) {
                  destructors.push(_free, ptr);
              }
              return ptr;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: function(ptr) { _free(ptr); },
      });
    }

  function _glBindTexture(target, texture) {
      GLctx.bindTexture(target, texture ? GL.textures[texture] : null);
    }

  function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget,
                                         GL.renderbuffers[renderbuffer]);
    }


  function _glDetachShader(program, shader) {
      GLctx.detachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _glGenBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var buffer = GLctx.createBuffer();
        if (!buffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((buffers)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.buffers);
        buffer.name = id;
        GL.buffers[id] = buffer;
        HEAP32[(((buffers)+(i*4))>>2)]=id;
      }
    }

  function __emval_take_value(type, argv) {
      type = requireRegisteredType(type, '_emval_take_value');
      var v = type['readValueFromPointer'](argv);
      return __emval_register(v);
    }

  var _llvm_pow_f32=Math_pow;

  function _glLineWidth(x0) { GLctx['lineWidth'](x0) }

   
  Module["_pthread_self"] = _pthread_self;

  function _emscripten_get_now() { abort() }

  
  var JSEvents={keyEvent:0,mouseEvent:0,wheelEvent:0,uiEvent:0,focusEvent:0,deviceOrientationEvent:0,deviceMotionEvent:0,fullscreenChangeEvent:0,pointerlockChangeEvent:0,visibilityChangeEvent:0,touchEvent:0,lastGamepadState:null,lastGamepadStateFrame:null,previousFullscreenElement:null,previousScreenX:null,previousScreenY:null,removeEventListenersRegistered:false,registerRemoveEventListeners:function () {
        if (!JSEvents.removeEventListenersRegistered) {
        __ATEXIT__.push(function() {
            for(var i = JSEvents.eventHandlers.length-1; i >= 0; --i) {
              JSEvents._removeHandler(i);
            }
           });
          JSEvents.removeEventListenersRegistered = true;
        }
      },findEventTarget:function (target) {
        if (target) {
          if (typeof target == "number") {
            target = Pointer_stringify(target);
          }
          if (target == '#window') return window;
          else if (target == '#document') return document;
          else if (target == '#screen') return window.screen;
          else if (target == '#canvas') return Module['canvas'];
  
          if (typeof target == 'string') return document.getElementById(target);
          else return target;
        } else {
          // The sensible target varies between events, but use window as the default
          // since DOM events mostly can default to that. Specific callback registrations
          // override their own defaults.
          return window;
        }
      },deferredCalls:[],deferCall:function (targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
  
          for(var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        // Test if the given call was already queued, and if so, don't add it again.
        for(var i in JSEvents.deferredCalls) {
          var call = JSEvents.deferredCalls[i];
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({
          targetFunction: targetFunction,
          precedence: precedence,
          argsList: argsList
        });
  
        JSEvents.deferredCalls.sort(function(x,y) { return x.precedence < y.precedence; });
      },removeDeferredCalls:function (targetFunction) {
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
            JSEvents.deferredCalls.splice(i, 1);
            --i;
          }
        }
      },canPerformEventHandlerRequests:function () {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },runDeferredCalls:function () {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        for(var i = 0; i < JSEvents.deferredCalls.length; ++i) {
          var call = JSEvents.deferredCalls[i];
          JSEvents.deferredCalls.splice(i, 1);
          --i;
          call.targetFunction.apply(this, call.argsList);
        }
      },inEventHandler:0,currentEventHandler:null,eventHandlers:[],isInternetExplorer:function () { return navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0; },removeAllHandlersOnTarget:function (target, eventTypeString) {
        for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (JSEvents.eventHandlers[i].target == target && 
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
             JSEvents._removeHandler(i--);
           }
        }
      },_removeHandler:function (i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },registerOrRemoveHandler:function (eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
          // Increment nesting count for the event handler.
          ++JSEvents.inEventHandler;
          JSEvents.currentEventHandler = eventHandler;
          // Process any old deferred calls the user has placed.
          JSEvents.runDeferredCalls();
          // Process the actual event, calls back to user C code handler.
          eventHandler.handlerFunc(event);
          // Process any new deferred calls that were placed right now from this event handler.
          JSEvents.runDeferredCalls();
          // Out of event handler - restore nesting count.
          --JSEvents.inEventHandler;
        }
        
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = jsEventHandler;
          eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
          JSEvents.eventHandlers.push(eventHandler);
          JSEvents.registerRemoveEventListeners();
        } else {
          for(var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == eventHandler.target
             && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
               JSEvents._removeHandler(i--);
             }
          }
        }
      },registerKeyEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.keyEvent) {
          JSEvents.keyEvent = _malloc( 164 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
          stringToUTF8(e.key ? e.key : "", JSEvents.keyEvent + 0, 32);
          stringToUTF8(e.code ? e.code : "", JSEvents.keyEvent + 32, 32);
          HEAP32[(((JSEvents.keyEvent)+(64))>>2)]=e.location;
          HEAP32[(((JSEvents.keyEvent)+(68))>>2)]=e.ctrlKey;
          HEAP32[(((JSEvents.keyEvent)+(72))>>2)]=e.shiftKey;
          HEAP32[(((JSEvents.keyEvent)+(76))>>2)]=e.altKey;
          HEAP32[(((JSEvents.keyEvent)+(80))>>2)]=e.metaKey;
          HEAP32[(((JSEvents.keyEvent)+(84))>>2)]=e.repeat;
          stringToUTF8(e.locale ? e.locale : "", JSEvents.keyEvent + 88, 32);
          stringToUTF8(e.char ? e.char : "", JSEvents.keyEvent + 120, 32);
          HEAP32[(((JSEvents.keyEvent)+(152))>>2)]=e.charCode;
          HEAP32[(((JSEvents.keyEvent)+(156))>>2)]=e.keyCode;
          HEAP32[(((JSEvents.keyEvent)+(160))>>2)]=e.which;
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.keyEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: JSEvents.isInternetExplorer() ? false : true, // MSIE doesn't allow fullscreen and pointerlock requests from key handlers, others do.
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },getBoundingClientRectOrZeros:function (target) {
        return target.getBoundingClientRect ? target.getBoundingClientRect() : { left: 0, top: 0 };
      },fillMouseEventData:function (eventStruct, e, target) {
        HEAPF64[((eventStruct)>>3)]=JSEvents.tick();
        HEAP32[(((eventStruct)+(8))>>2)]=e.screenX;
        HEAP32[(((eventStruct)+(12))>>2)]=e.screenY;
        HEAP32[(((eventStruct)+(16))>>2)]=e.clientX;
        HEAP32[(((eventStruct)+(20))>>2)]=e.clientY;
        HEAP32[(((eventStruct)+(24))>>2)]=e.ctrlKey;
        HEAP32[(((eventStruct)+(28))>>2)]=e.shiftKey;
        HEAP32[(((eventStruct)+(32))>>2)]=e.altKey;
        HEAP32[(((eventStruct)+(36))>>2)]=e.metaKey;
        HEAP16[(((eventStruct)+(40))>>1)]=e.button;
        HEAP16[(((eventStruct)+(42))>>1)]=e.buttons;
        HEAP32[(((eventStruct)+(44))>>2)]=e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || (e.screenX-JSEvents.previousScreenX);
        HEAP32[(((eventStruct)+(48))>>2)]=e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || (e.screenY-JSEvents.previousScreenY);
  
        if (Module['canvas']) {
          var rect = Module['canvas'].getBoundingClientRect();
          HEAP32[(((eventStruct)+(60))>>2)]=e.clientX - rect.left;
          HEAP32[(((eventStruct)+(64))>>2)]=e.clientY - rect.top;
        } else { // Canvas is not initialized, return 0.
          HEAP32[(((eventStruct)+(60))>>2)]=0;
          HEAP32[(((eventStruct)+(64))>>2)]=0;
        }
        if (target) {
          var rect = JSEvents.getBoundingClientRectOrZeros(target);
          HEAP32[(((eventStruct)+(52))>>2)]=e.clientX - rect.left;
          HEAP32[(((eventStruct)+(56))>>2)]=e.clientY - rect.top;        
        } else { // No specific target passed, return 0.
          HEAP32[(((eventStruct)+(52))>>2)]=0;
          HEAP32[(((eventStruct)+(56))>>2)]=0;
        }
        JSEvents.previousScreenX = e.screenX;
        JSEvents.previousScreenY = e.screenY;
      },registerMouseEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.mouseEvent) {
          JSEvents.mouseEvent = _malloc( 72 );
        }
        target = JSEvents.findEventTarget(target);
        var handlerFunc = function(event) {
          var e = event || window.event;
          JSEvents.fillMouseEventData(JSEvents.mouseEvent, e, target);
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.mouseEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: eventTypeString != 'mousemove' && eventTypeString != 'mouseenter' && eventTypeString != 'mouseleave', // Mouse move events do not allow fullscreen/pointer lock requests to be handled in them!
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        // In IE, mousedown events don't either allow deferred calls to be run!
        if (JSEvents.isInternetExplorer() && eventTypeString == 'mousedown') eventHandler.allowsDeferredCalls = false;
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerWheelEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.wheelEvent) {
          JSEvents.wheelEvent = _malloc( 104 );
        }
        target = JSEvents.findEventTarget(target);
        // The DOM Level 3 events spec event 'wheel'
        var wheelHandlerFunc = function(event) {
          var e = event || window.event;
          JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
          HEAPF64[(((JSEvents.wheelEvent)+(72))>>3)]=e["deltaX"];
          HEAPF64[(((JSEvents.wheelEvent)+(80))>>3)]=e["deltaY"];
          HEAPF64[(((JSEvents.wheelEvent)+(88))>>3)]=e["deltaZ"];
          HEAP32[(((JSEvents.wheelEvent)+(96))>>2)]=e["deltaMode"];
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.wheelEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
        // The 'mousewheel' event as implemented in Safari 6.0.5
        var mouseWheelHandlerFunc = function(event) {
          var e = event || window.event;
          JSEvents.fillMouseEventData(JSEvents.wheelEvent, e, target);
          HEAPF64[(((JSEvents.wheelEvent)+(72))>>3)]=e["wheelDeltaX"] || 0;
          HEAPF64[(((JSEvents.wheelEvent)+(80))>>3)]=-(e["wheelDeltaY"] ? e["wheelDeltaY"] : e["wheelDelta"]) /* 1. Invert to unify direction with the DOM Level 3 wheel event. 2. MSIE does not provide wheelDeltaY, so wheelDelta is used as a fallback. */;
          HEAPF64[(((JSEvents.wheelEvent)+(88))>>3)]=0 /* Not available */;
          HEAP32[(((JSEvents.wheelEvent)+(96))>>2)]=0 /* DOM_DELTA_PIXEL */;
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.wheelEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: true,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: (eventTypeString == 'wheel') ? wheelHandlerFunc : mouseWheelHandlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },pageScrollPos:function () {
        if (window.pageXOffset > 0 || window.pageYOffset > 0) {
          return [window.pageXOffset, window.pageYOffset];
        }
        if (typeof document.documentElement.scrollLeft !== 'undefined' || typeof document.documentElement.scrollTop !== 'undefined') {
          return [document.documentElement.scrollLeft, document.documentElement.scrollTop];
        }
        return [document.body.scrollLeft|0, document.body.scrollTop|0];
      },registerUiEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.uiEvent) {
          JSEvents.uiEvent = _malloc( 36 );
        }
  
        if (eventTypeString == "scroll" && !target) {
          target = document; // By default read scroll events on document rather than window.
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
          if (e.target != target) {
            // Never take ui events such as scroll via a 'bubbled' route, but always from the direct element that
            // was targeted. Otherwise e.g. if app logs a message in response to a page scroll, the Emscripten log
            // message box could cause to scroll, generating a new (bubbled) scroll message, causing a new log print,
            // causing a new scroll, etc..
            return;
          }
          var scrollPos = JSEvents.pageScrollPos();
          HEAP32[((JSEvents.uiEvent)>>2)]=e.detail;
          HEAP32[(((JSEvents.uiEvent)+(4))>>2)]=document.body.clientWidth;
          HEAP32[(((JSEvents.uiEvent)+(8))>>2)]=document.body.clientHeight;
          HEAP32[(((JSEvents.uiEvent)+(12))>>2)]=window.innerWidth;
          HEAP32[(((JSEvents.uiEvent)+(16))>>2)]=window.innerHeight;
          HEAP32[(((JSEvents.uiEvent)+(20))>>2)]=window.outerWidth;
          HEAP32[(((JSEvents.uiEvent)+(24))>>2)]=window.outerHeight;
          HEAP32[(((JSEvents.uiEvent)+(28))>>2)]=scrollPos[0];
          HEAP32[(((JSEvents.uiEvent)+(32))>>2)]=scrollPos[1];
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.uiEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false, // Neither scroll or resize events allow running requests inside them.
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },getNodeNameForTarget:function (target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == window.screen) return '#screen';
        return (target && target.nodeName) ? target.nodeName : '';
      },registerFocusEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.focusEvent) {
          JSEvents.focusEvent = _malloc( 256 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var nodeName = JSEvents.getNodeNameForTarget(e.target);
          var id = e.target.id ? e.target.id : '';
          stringToUTF8(nodeName, JSEvents.focusEvent + 0, 128);
          stringToUTF8(id, JSEvents.focusEvent + 128, 128);
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.focusEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },tick:function () {
        if (window['performance'] && window['performance']['now']) return window['performance']['now']();
        else return Date.now();
      },registerDeviceOrientationEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.deviceOrientationEvent) {
          JSEvents.deviceOrientationEvent = _malloc( 40 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          HEAPF64[((JSEvents.deviceOrientationEvent)>>3)]=JSEvents.tick();
          HEAPF64[(((JSEvents.deviceOrientationEvent)+(8))>>3)]=e.alpha;
          HEAPF64[(((JSEvents.deviceOrientationEvent)+(16))>>3)]=e.beta;
          HEAPF64[(((JSEvents.deviceOrientationEvent)+(24))>>3)]=e.gamma;
          HEAP32[(((JSEvents.deviceOrientationEvent)+(32))>>2)]=e.absolute;
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.deviceOrientationEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerDeviceMotionEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.deviceMotionEvent) {
          JSEvents.deviceMotionEvent = _malloc( 80 );
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          HEAPF64[((JSEvents.deviceOrientationEvent)>>3)]=JSEvents.tick();
          HEAPF64[(((JSEvents.deviceMotionEvent)+(8))>>3)]=e.acceleration.x;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(16))>>3)]=e.acceleration.y;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(24))>>3)]=e.acceleration.z;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(32))>>3)]=e.accelerationIncludingGravity.x;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(40))>>3)]=e.accelerationIncludingGravity.y;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(48))>>3)]=e.accelerationIncludingGravity.z;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(56))>>3)]=e.rotationRate.alpha;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(64))>>3)]=e.rotationRate.beta;
          HEAPF64[(((JSEvents.deviceMotionEvent)+(72))>>3)]=e.rotationRate.gamma;
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.deviceMotionEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },screenOrientation:function () {
        if (!window.screen) return undefined;
        return window.screen.orientation || window.screen.mozOrientation || window.screen.webkitOrientation || window.screen.msOrientation;
      },fillOrientationChangeEventData:function (eventStruct, e) {
        var orientations  = ["portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"];
        var orientations2 = ["portrait",         "portrait",           "landscape",         "landscape"];
  
        var orientationString = JSEvents.screenOrientation();
        var orientation = orientations.indexOf(orientationString);
        if (orientation == -1) {
          orientation = orientations2.indexOf(orientationString);
        }
  
        HEAP32[((eventStruct)>>2)]=1 << orientation;
        HEAP32[(((eventStruct)+(4))>>2)]=window.orientation;
      },registerOrientationChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.orientationChangeEvent) {
          JSEvents.orientationChangeEvent = _malloc( 8 );
        }
  
        if (!target) {
          target = window.screen; // Orientation events need to be captured from 'window.screen' instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillOrientationChangeEventData(JSEvents.orientationChangeEvent, e);
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.orientationChangeEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        if (eventTypeString == "orientationchange" && window.screen.mozOrientation !== undefined) {
          eventTypeString = "mozorientationchange";
        }
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },fullscreenEnabled:function () {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
      },fillFullscreenChangeEventData:function (eventStruct, e) {
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        var isFullscreen = !!fullscreenElement;
        HEAP32[((eventStruct)>>2)]=isFullscreen;
        HEAP32[(((eventStruct)+(4))>>2)]=JSEvents.fullscreenEnabled();
        // If transitioning to fullscreen, report info about the element that is now fullscreen.
        // If transitioning to windowed mode, report info about the element that just was fullscreen.
        var reportedElement = isFullscreen ? fullscreenElement : JSEvents.previousFullscreenElement;
        var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
        var id = (reportedElement && reportedElement.id) ? reportedElement.id : '';
        stringToUTF8(nodeName, eventStruct + 8, 128);
        stringToUTF8(id, eventStruct + 136, 128);
        HEAP32[(((eventStruct)+(264))>>2)]=reportedElement ? reportedElement.clientWidth : 0;
        HEAP32[(((eventStruct)+(268))>>2)]=reportedElement ? reportedElement.clientHeight : 0;
        HEAP32[(((eventStruct)+(272))>>2)]=screen.width;
        HEAP32[(((eventStruct)+(276))>>2)]=screen.height;
        if (isFullscreen) {
          JSEvents.previousFullscreenElement = fullscreenElement;
        }
      },registerFullscreenChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.fullscreenChangeEvent) {
          JSEvents.fullscreenChangeEvent = _malloc( 280 );
        }
  
        if (!target) {
          target = document; // Fullscreen change events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillFullscreenChangeEventData(JSEvents.fullscreenChangeEvent, e);
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.fullscreenChangeEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },resizeCanvasForFullscreen:function (target, strategy) {
        var restoreOldStyle = __registerRestoreOldStyle(target);
        var cssWidth = strategy.softFullscreen ? window.innerWidth : screen.width;
        var cssHeight = strategy.softFullscreen ? window.innerHeight : screen.height;
        var rect = target.getBoundingClientRect();
        var windowedCssWidth = rect.right - rect.left;
        var windowedCssHeight = rect.bottom - rect.top;
        var windowedRttWidth = target.width;
        var windowedRttHeight = target.height;
  
        if (strategy.scaleMode == 3) {
          __setLetterbox(target, (cssHeight - windowedCssHeight) / 2, (cssWidth - windowedCssWidth) / 2);
          cssWidth = windowedCssWidth;
          cssHeight = windowedCssHeight;
        } else if (strategy.scaleMode == 2) {
          if (cssWidth*windowedRttHeight < windowedRttWidth*cssHeight) {
            var desiredCssHeight = windowedRttHeight * cssWidth / windowedRttWidth;
            __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
            cssHeight = desiredCssHeight;
          } else {
            var desiredCssWidth = windowedRttWidth * cssHeight / windowedRttHeight;
            __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
            cssWidth = desiredCssWidth;
          }
        }
  
        // If we are adding padding, must choose a background color or otherwise Chrome will give the
        // padding a default white color. Do it only if user has not customized their own background color.
        if (!target.style.backgroundColor) target.style.backgroundColor = 'black';
        // IE11 does the same, but requires the color to be set in the document body.
        if (!document.body.style.backgroundColor) document.body.style.backgroundColor = 'black'; // IE11
        // Firefox always shows black letterboxes independent of style color.
  
        target.style.width = cssWidth + 'px';
        target.style.height = cssHeight + 'px';
  
        if (strategy.filteringMode == 1) {
          target.style.imageRendering = 'optimizeSpeed';
          target.style.imageRendering = '-moz-crisp-edges';
          target.style.imageRendering = '-o-crisp-edges';
          target.style.imageRendering = '-webkit-optimize-contrast';
          target.style.imageRendering = 'optimize-contrast';
          target.style.imageRendering = 'crisp-edges';
          target.style.imageRendering = 'pixelated';
        }
  
        var dpiScale = (strategy.canvasResolutionScaleMode == 2) ? window.devicePixelRatio : 1;
        if (strategy.canvasResolutionScaleMode != 0) {
          target.width = cssWidth * dpiScale;
          target.height = cssHeight * dpiScale;
          if (target.GLctxObject) target.GLctxObject.GLctx.viewport(0, 0, target.width, target.height);
        }
        return restoreOldStyle;
      },requestFullscreen:function (target, strategy) {
        // EMSCRIPTEN_FULLSCREEN_SCALE_DEFAULT + EMSCRIPTEN_FULLSCREEN_CANVAS_SCALE_NONE is a mode where no extra logic is performed to the DOM elements.
        if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
          JSEvents.resizeCanvasForFullscreen(target, strategy);
        }
  
        if (target.requestFullscreen) {
          target.requestFullscreen();
        } else if (target.msRequestFullscreen) {
          target.msRequestFullscreen();
        } else if (target.mozRequestFullScreen) {
          target.mozRequestFullScreen();
        } else if (target.mozRequestFullscreen) {
          target.mozRequestFullscreen();
        } else if (target.webkitRequestFullscreen) {
          target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
          if (typeof JSEvents.fullscreenEnabled() === 'undefined') {
            return -1;
          } else {
            return -3;
          }
        }
  
        if (strategy.canvasResizedCallback) {
          Runtime.dynCall('iiii', strategy.canvasResizedCallback, [37, 0, strategy.canvasResizedCallbackUserData]);
        }
  
        return 0;
      },fillPointerlockChangeEventData:function (eventStruct, e) {
        var pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
        var isPointerlocked = !!pointerLockElement;
        HEAP32[((eventStruct)>>2)]=isPointerlocked;
        var nodeName = JSEvents.getNodeNameForTarget(pointerLockElement);
        var id = (pointerLockElement && pointerLockElement.id) ? pointerLockElement.id : '';
        stringToUTF8(nodeName, eventStruct + 4, 128);
        stringToUTF8(id, eventStruct + 132, 128);
      },registerPointerlockChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.pointerlockChangeEvent) {
          JSEvents.pointerlockChangeEvent = _malloc( 260 );
        }
  
        if (!target) {
          target = document; // Pointer lock change events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillPointerlockChangeEventData(JSEvents.pointerlockChangeEvent, e);
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.pointerlockChangeEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerPointerlockErrorEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!target) {
          target = document; // Pointer lock events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, 0, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },requestPointerLock:function (target) {
        if (target.requestPointerLock) {
          target.requestPointerLock();
        } else if (target.mozRequestPointerLock) {
          target.mozRequestPointerLock();
        } else if (target.webkitRequestPointerLock) {
          target.webkitRequestPointerLock();
        } else if (target.msRequestPointerLock) {
          target.msRequestPointerLock();
        } else {
          // document.body is known to accept pointer lock, so use that to differentiate if the user passed a bad element,
          // or if the whole browser just doesn't support the feature.
          if (document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock) {
            return -3;
          } else {
            return -1;
          }
        }
        return 0;
      },fillVisibilityChangeEventData:function (eventStruct, e) {
        var visibilityStates = [ "hidden", "visible", "prerender", "unloaded" ];
        var visibilityState = visibilityStates.indexOf(document.visibilityState);
  
        HEAP32[((eventStruct)>>2)]=document.hidden;
        HEAP32[(((eventStruct)+(4))>>2)]=visibilityState;
      },registerVisibilityChangeEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.visibilityChangeEvent) {
          JSEvents.visibilityChangeEvent = _malloc( 8 );
        }
  
        if (!target) {
          target = document; // Visibility change events need to be captured from 'document' by default instead of 'window'
        } else {
          target = JSEvents.findEventTarget(target);
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillVisibilityChangeEventData(JSEvents.visibilityChangeEvent, e);
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.visibilityChangeEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerTouchEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.touchEvent) {
          JSEvents.touchEvent = _malloc( 1684 );
        }
  
        target = JSEvents.findEventTarget(target);
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var touches = {};
          for(var i = 0; i < e.touches.length; ++i) {
            var touch = e.touches[i];
            touches[touch.identifier] = touch;
          }
          for(var i = 0; i < e.changedTouches.length; ++i) {
            var touch = e.changedTouches[i];
            touches[touch.identifier] = touch;
            touch.changed = true;
          }
          for(var i = 0; i < e.targetTouches.length; ++i) {
            var touch = e.targetTouches[i];
            touches[touch.identifier].onTarget = true;
          }
          
          var ptr = JSEvents.touchEvent;
          HEAP32[(((ptr)+(4))>>2)]=e.ctrlKey;
          HEAP32[(((ptr)+(8))>>2)]=e.shiftKey;
          HEAP32[(((ptr)+(12))>>2)]=e.altKey;
          HEAP32[(((ptr)+(16))>>2)]=e.metaKey;
          ptr += 20; // Advance to the start of the touch array.
          var canvasRect = Module['canvas'] ? Module['canvas'].getBoundingClientRect() : undefined;
          var targetRect = JSEvents.getBoundingClientRectOrZeros(target);
          var numTouches = 0;
          for(var i in touches) {
            var t = touches[i];
            HEAP32[((ptr)>>2)]=t.identifier;
            HEAP32[(((ptr)+(4))>>2)]=t.screenX;
            HEAP32[(((ptr)+(8))>>2)]=t.screenY;
            HEAP32[(((ptr)+(12))>>2)]=t.clientX;
            HEAP32[(((ptr)+(16))>>2)]=t.clientY;
            HEAP32[(((ptr)+(20))>>2)]=t.pageX;
            HEAP32[(((ptr)+(24))>>2)]=t.pageY;
            HEAP32[(((ptr)+(28))>>2)]=t.changed;
            HEAP32[(((ptr)+(32))>>2)]=t.onTarget;
            if (canvasRect) {
              HEAP32[(((ptr)+(44))>>2)]=t.clientX - canvasRect.left;
              HEAP32[(((ptr)+(48))>>2)]=t.clientY - canvasRect.top;
            } else {
              HEAP32[(((ptr)+(44))>>2)]=0;
              HEAP32[(((ptr)+(48))>>2)]=0;            
            }
            HEAP32[(((ptr)+(36))>>2)]=t.clientX - targetRect.left;
            HEAP32[(((ptr)+(40))>>2)]=t.clientY - targetRect.top;
            
            ptr += 52;
  
            if (++numTouches >= 32) {
              break;
            }
          }
          HEAP32[((JSEvents.touchEvent)>>2)]=numTouches;
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.touchEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: target,
          allowsDeferredCalls: false, // XXX Currently disabled, see bug https://bugzilla.mozilla.org/show_bug.cgi?id=966493
          // Once the above bug is resolved, enable the following condition if possible:
          // allowsDeferredCalls: eventTypeString == 'touchstart',
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },fillGamepadEventData:function (eventStruct, e) {
        HEAPF64[((eventStruct)>>3)]=e.timestamp;
        for(var i = 0; i < e.axes.length; ++i) {
          HEAPF64[(((eventStruct+i*8)+(16))>>3)]=e.axes[i];
        }
        for(var i = 0; i < e.buttons.length; ++i) {
          if (typeof(e.buttons[i]) === 'object') {
            HEAPF64[(((eventStruct+i*8)+(528))>>3)]=e.buttons[i].value;
          } else {
            HEAPF64[(((eventStruct+i*8)+(528))>>3)]=e.buttons[i];
          }
        }
        for(var i = 0; i < e.buttons.length; ++i) {
          if (typeof(e.buttons[i]) === 'object') {
            HEAP32[(((eventStruct+i*4)+(1040))>>2)]=e.buttons[i].pressed;
          } else {
            HEAP32[(((eventStruct+i*4)+(1040))>>2)]=e.buttons[i] == 1.0;
          }
        }
        HEAP32[(((eventStruct)+(1296))>>2)]=e.connected;
        HEAP32[(((eventStruct)+(1300))>>2)]=e.index;
        HEAP32[(((eventStruct)+(8))>>2)]=e.axes.length;
        HEAP32[(((eventStruct)+(12))>>2)]=e.buttons.length;
        stringToUTF8(e.id, eventStruct + 1304, 64);
        stringToUTF8(e.mapping, eventStruct + 1368, 64);
      },registerGamepadEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.gamepadEvent) {
          JSEvents.gamepadEvent = _malloc( 1432 );
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillGamepadEventData(JSEvents.gamepadEvent, e.gamepad);
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.gamepadEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: true,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerBeforeUnloadEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var confirmationMessage = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, 0, userData]);
          
          if (confirmationMessage) {
            confirmationMessage = Pointer_stringify(confirmationMessage);
          }
          if (confirmationMessage) {
            e.preventDefault();
            e.returnValue = confirmationMessage;
            return confirmationMessage;
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },battery:function () { return navigator.battery || navigator.mozBattery || navigator.webkitBattery; },fillBatteryEventData:function (eventStruct, e) {
        HEAPF64[((eventStruct)>>3)]=e.chargingTime;
        HEAPF64[(((eventStruct)+(8))>>3)]=e.dischargingTime;
        HEAPF64[(((eventStruct)+(16))>>3)]=e.level;
        HEAP32[(((eventStruct)+(24))>>2)]=e.charging;
      },registerBatteryEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!JSEvents.batteryEvent) {
          JSEvents.batteryEvent = _malloc( 32 );
        }
  
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          JSEvents.fillBatteryEventData(JSEvents.batteryEvent, JSEvents.battery());
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, JSEvents.batteryEvent, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      },registerWebGlEventCallback:function (target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString) {
        if (!target) {
          target = Module['canvas'];
        }
        var handlerFunc = function(event) {
          var e = event || window.event;
  
          var shouldCancel = Runtime.dynCall('iiii', callbackfunc, [eventTypeId, 0, userData]);
          if (shouldCancel) {
            e.preventDefault();
          }
        };
  
        var eventHandler = {
          target: JSEvents.findEventTarget(target),
          allowsDeferredCalls: false,
          eventTypeString: eventTypeString,
          callbackfunc: callbackfunc,
          handlerFunc: handlerFunc,
          useCapture: useCapture
        };
        JSEvents.registerOrRemoveHandler(eventHandler);
      }};function _emscripten_set_mouseup_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup");
      return 0;
    }

  function _emscripten_webgl_destroy_context(contextHandle) {
      GL.deleteContext(contextHandle);
    }

  
  var TulipUtils={requestedAnimationFrame:false,fullScreenCanvasId:null,canvasFSOldWidth:0,canvasFSOldHeight:0,onFullScreenEventChange:function (event) {
        var width;
        var height;
        var tulipView = tulip.getViewForCanvasId(TulipUtils.fullScreenCanvasId);
        if (document['fullScreen'] || document['mozFullScreen'] || document['webkitIsFullScreen']) {
          width = screen['width'];
          height = screen['height'];
          tulipView.fullScreenActivated = true;
        } else {
          width = TulipUtils.canvasFSOldWidth;
          height = TulipUtils.canvasFSOldHeight;
          document.removeEventListener('fullscreenchange', TulipUtils.onFullScreenEventChange, true);
          document.removeEventListener('mozfullscreenchange', TulipUtils.onFullScreenEventChange, true);
          document.removeEventListener('webkitfullscreenchange', TulipUtils.onFullScreenEventChange, true);
          tulipView.fullScreenActivated = false;
        }
        tulipView.resize(width, height);
        tulipView.draw();
      }};function _setProgressBarValueWorker(graphId, value) {
      tulip.sendProgressValue(graphId, value);
    }

   
  Module["_pthread_mutex_trylock"] = _pthread_mutex_trylock;

  function _glCompileShader(shader) {
      GLctx.compileShader(GL.shaders[shader]);
    }

  function ___syscall54(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // ioctl
      var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
      switch (op) {
        case 21505: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0;
        }
        case 21506: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          var argp = SYSCALLS.get();
          HEAP32[((argp)>>2)]=0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -ERRNO_CODES.ENOTTY;
          return -ERRNO_CODES.EINVAL; // not supported
        }
        case 21531: {
          var argp = SYSCALLS.get();
          return FS.ioctl(stream, op, argp);
        }
        default: abort('bad ioctl syscall ' + op);
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  var ___tm_current=STATICTOP; STATICTOP += 48;;
  
  
  var ___tm_timezone=allocate(intArrayFromString("GMT"), "i8", ALLOC_STATIC);
  
  
  var _tzname=STATICTOP; STATICTOP += 16;;
  
  var _daylight=STATICTOP; STATICTOP += 16;;
  
  var _timezone=STATICTOP; STATICTOP += 16;;function _tzset() {
      // TODO: Use (malleable) environment variables instead of system settings.
      if (_tzset.called) return;
      _tzset.called = true;
  
      HEAP32[((_timezone)>>2)]=-(new Date()).getTimezoneOffset() * 60;
  
      var winter = new Date(2000, 0, 1);
      var summer = new Date(2000, 6, 1);
      HEAP32[((_daylight)>>2)]=Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());
  
      function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT";
      };
      var winterName = extractZone(winter);
      var summerName = extractZone(summer);
      var winterNamePtr = allocate(intArrayFromString(winterName), 'i8', ALLOC_NORMAL);
      var summerNamePtr = allocate(intArrayFromString(summerName), 'i8', ALLOC_NORMAL);
      if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        // Northern hemisphere
        HEAP32[((_tzname)>>2)]=winterNamePtr;
        HEAP32[(((_tzname)+(4))>>2)]=summerNamePtr;
      } else {
        HEAP32[((_tzname)>>2)]=summerNamePtr;
        HEAP32[(((_tzname)+(4))>>2)]=winterNamePtr;
      }
    }function _localtime_r(time, tmPtr) {
      _tzset();
      var date = new Date(HEAP32[((time)>>2)]*1000);
      HEAP32[((tmPtr)>>2)]=date.getSeconds();
      HEAP32[(((tmPtr)+(4))>>2)]=date.getMinutes();
      HEAP32[(((tmPtr)+(8))>>2)]=date.getHours();
      HEAP32[(((tmPtr)+(12))>>2)]=date.getDate();
      HEAP32[(((tmPtr)+(16))>>2)]=date.getMonth();
      HEAP32[(((tmPtr)+(20))>>2)]=date.getFullYear()-1900;
      HEAP32[(((tmPtr)+(24))>>2)]=date.getDay();
  
      var start = new Date(date.getFullYear(), 0, 1);
      var yday = ((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))|0;
      HEAP32[(((tmPtr)+(28))>>2)]=yday;
      HEAP32[(((tmPtr)+(36))>>2)]=-(date.getTimezoneOffset() * 60);
  
      // DST is in December in South
      var summerOffset = new Date(2000, 6, 1).getTimezoneOffset();
      var winterOffset = start.getTimezoneOffset();
      var dst = (date.getTimezoneOffset() == Math.min(winterOffset, summerOffset))|0;
      HEAP32[(((tmPtr)+(32))>>2)]=dst;
  
      var zonePtr = HEAP32[(((_tzname)+(dst ? Runtime.QUANTUM_SIZE : 0))>>2)];
      HEAP32[(((tmPtr)+(40))>>2)]=zonePtr;
  
      return tmPtr;
    }function _localtime(time) {
      return _localtime_r(time, ___tm_current);
    }

  function _glDeleteTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((textures)+(i*4))>>2)];
        var texture = GL.textures[id];
        if (!texture) continue; // GL spec: "glDeleteTextures silently ignores 0s and names that do not correspond to existing textures".
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    }

  function _glStencilOpSeparate(x0, x1, x2, x3) { GLctx['stencilOpSeparate'](x0, x1, x2, x3) }

  function _pthread_cleanup_push(routine, arg) {
      __ATEXIT__.push(function() { Runtime.dynCall('vi', routine, [arg]) })
      _pthread_cleanup_push.level = __ATEXIT__.length;
    }

  function _blurCanvas(canvasId) {
      var canvas = document.getElementById(Pointer_stringify(canvasId));
      if (!canvas) return;
      canvas.blur();
    }

  
  function __emval_allocateDestructors(destructorsRef) {
      var destructors = [];
      HEAP32[destructorsRef >> 2] = __emval_register(destructors);
      return destructors;
    }
  
  
  var emval_symbols={};function getStringOrSymbol(address) {
      var symbol = emval_symbols[address];
      if (symbol === undefined) {
          return readLatin1String(address);
      } else {
          return symbol;
      }
    }
  
  var emval_methodCallers=[];function __emval_call_void_method(caller, handle, methodName, args) {
      caller = emval_methodCallers[caller];
      handle = requireHandle(handle);
      methodName = getStringOrSymbol(methodName);
      caller(handle, methodName, null, args);
    }

  function _glClearStencil(x0) { GLctx['clearStencil'](x0) }

  
  function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
          emval_handle_array[handle] = undefined;
          emval_free_list.push(handle);
      }
    }
  
  function runDestructors(destructors) {
      while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
      }
    }function __emval_run_destructors(handle) {
      var destructors = emval_handle_array[handle].value;
      runDestructors(destructors);
      __emval_decref(handle);
    }

  function _glVertexAttribDivisorARB(index, divisor) {
      GLctx['vertexAttribDivisor'](index, divisor);
    }

  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy;

   
  Module["_memmove"] = _memmove;

  function _glGenTextures(n, textures) {
      for (var i = 0; i < n; i++) {
        var texture = GLctx.createTexture();
        if (!texture) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */); // GLES + EGL specs don't specify what should happen here, so best to issue an error and create IDs with 0.
          while(i < n) HEAP32[(((textures)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.textures);
        texture.name = id;
        GL.textures[id] = texture;
        HEAP32[(((textures)+(i*4))>>2)]=id;
      }
    }

  
  var __sigalrm_handler=0;function _signal(sig, func) {
      if (sig == 14 /*SIGALRM*/) {
        __sigalrm_handler = func;
      } else {
      }
      return 0;
    }

  function _glColorMask(red, green, blue, alpha) {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    }

  function _isChrome() {
      return navigator.userAgent.toLowerCase().indexOf('chrome') > -1 &&
             navigator.vendor.toLowerCase().indexOf('google inc') > -1;
    }

  function _glDeleteShader(id) {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) { // glDeleteShader actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    }

  function _pthread_cond_wait() { return 0; }

  function _glUniform1f(location, v0) {
      location = GL.uniforms[location];
      GLctx.uniform1f(location, v0);
    }

  function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(handle) {
              var rv = emval_handle_array[handle].value;
              __emval_decref(handle);
              return rv;
          },
          'toWireType': function(destructors, value) {
              return __emval_register(value);
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: null, // This type does not need a destructor
  
          // TODO: do we need a deleteObject here?  write a test where
          // emval is passed into JS via an interface
      });
    }

  function _canXhrOnUrl(url) {
      if (window.location.protocol == 'http:') {
        return true;
      }
      var fileOk = true;
      try {
        Browser.xhrLoad(Pointer_stringify(url), function(array) {}, function() {});
      } catch (e) {
        fileOk = false;
      }
      return fileOk;
    }

  function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
      ];
  
      var TA = typeMapping[dataTypeIndex];
  
      function decodeMemoryView(handle) {
          handle = handle >> 2;
          var heap = HEAPU32;
          var size = heap[handle]; // in elements
          var data = heap[handle + 1]; // byte offset into emscripten heap
          return new TA(heap['buffer'], data, size);
      }
  
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': decodeMemoryView,
          'argPackAdvance': 8,
          'readValueFromPointer': decodeMemoryView,
      }, {
          ignoreDuplicateRegistrations: true,
      });
    }

  function _glCreateShader(shaderType) {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    }

  function _glUniform1i(location, v0) {
      location = GL.uniforms[location];
      GLctx.uniform1i(location, v0);
    }

  function __emval_incref(handle) {
      if (handle > 4) {
          emval_handle_array[handle].refcount += 1;
      }
    }

  function _glGenRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var renderbuffer = GLctx.createRenderbuffer();
        if (!renderbuffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((renderbuffers)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.renderbuffers);
        renderbuffer.name = id;
        GL.renderbuffers[id] = renderbuffer;
        HEAP32[(((renderbuffers)+(i*4))>>2)]=id;
      }
    }

  
  
  function emscriptenWebGLComputeImageSize(width, height, sizePerPixel, alignment) {
      function roundedToNextMultipleOf(x, y) {
        return Math.floor((x + y - 1) / y) * y
      }
      var plainRowSize = width * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
      return (height <= 0) ? 0 :
               ((height - 1) * alignedRowSize + plainRowSize);
    }function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
      var sizePerPixel;
      var numChannels;
      switch(format) {
        case 0x1906 /* GL_ALPHA */:
        case 0x1909 /* GL_LUMINANCE */:
        case 0x1902 /* GL_DEPTH_COMPONENT */:
          numChannels = 1;
          break;
        case 0x190A /* GL_LUMINANCE_ALPHA */:
          numChannels = 2;
          break;
        case 0x1907 /* GL_RGB */:
        case 0x8C40 /* GL_SRGB_EXT */:
          numChannels = 3;
          break;
        case 0x1908 /* GL_RGBA */:
        case 0x8C42 /* GL_SRGB_ALPHA_EXT */:
          numChannels = 4;
          break;
        default:
          GL.recordError(0x0500); // GL_INVALID_ENUM
          return null;
      }
      switch (type) {
        case 0x1401 /* GL_UNSIGNED_BYTE */:
          sizePerPixel = numChannels*1;
          break;
        case 0x1403 /* GL_UNSIGNED_SHORT */:
        case 0x8D61 /* GL_HALF_FLOAT_OES */:
          sizePerPixel = numChannels*2;
          break;
        case 0x1405 /* GL_UNSIGNED_INT */:
        case 0x1406 /* GL_FLOAT */:
          sizePerPixel = numChannels*4;
          break;
        case 0x84FA /* GL_UNSIGNED_INT_24_8_WEBGL/GL_UNSIGNED_INT_24_8 */:
          sizePerPixel = 4;
          break;
        case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
        case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
        case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
          sizePerPixel = 2;
          break;
        default:
          GL.recordError(0x0500); // GL_INVALID_ENUM
          return null;
      }
      var bytes = emscriptenWebGLComputeImageSize(width, height, sizePerPixel, GL.unpackAlignment);
      switch(type) {
        case 0x1401 /* GL_UNSIGNED_BYTE */:
          return HEAPU8.subarray((pixels),(pixels+bytes));
        case 0x1406 /* GL_FLOAT */:
          return HEAPF32.subarray((pixels)>>2,(pixels+bytes)>>2);
        case 0x1405 /* GL_UNSIGNED_INT */:
        case 0x84FA /* GL_UNSIGNED_INT_24_8_WEBGL/GL_UNSIGNED_INT_24_8 */:
          return HEAPU32.subarray((pixels)>>2,(pixels+bytes)>>2);
        case 0x1403 /* GL_UNSIGNED_SHORT */:
        case 0x8363 /* GL_UNSIGNED_SHORT_5_6_5 */:
        case 0x8033 /* GL_UNSIGNED_SHORT_4_4_4_4 */:
        case 0x8034 /* GL_UNSIGNED_SHORT_5_5_5_1 */:
        case 0x8D61 /* GL_HALF_FLOAT_OES */:
          return HEAPU16.subarray((pixels)>>1,(pixels+bytes)>>1);
        default:
          GL.recordError(0x0500); // GL_INVALID_ENUM
          return null;
      }
    }function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
      GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
    }

  function _glDisable(x0) { GLctx['disable'](x0) }

  function _glUniform2f(location, v0, v1) {
      location = GL.uniforms[location];
      GLctx.uniform2f(location, v0, v1);
    }

   
  Module["_memset"] = _memset;

  function _domElementExists(elementId) {
      return document.getElementById(Pointer_stringify(elementId)) != null;
    }

  function _glGetProgramiv(program, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it. 
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
  
      if (program >= GL.counter) {
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
        return;
      }
  
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else if (pname == 0x8B87 /* GL_ACTIVE_UNIFORM_MAX_LENGTH */) {
        HEAP32[((p)>>2)]=ptable.maxUniformLength;
      } else if (pname == 0x8B8A /* GL_ACTIVE_ATTRIBUTE_MAX_LENGTH */) {
        if (ptable.maxAttributeLength == -1) {
          var program = GL.programs[program];
          var numAttribs = GLctx.getProgramParameter(program, GLctx.ACTIVE_ATTRIBUTES);
          ptable.maxAttributeLength = 0; // Spec says if there are no active attribs, 0 must be returned.
          for (var i = 0; i < numAttribs; ++i) {
            var activeAttrib = GLctx.getActiveAttrib(program, i);
            ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxAttributeLength;
      } else if (pname == 0x8A35 /* GL_ACTIVE_UNIFORM_BLOCK_MAX_NAME_LENGTH */) {
        if (ptable.maxUniformBlockNameLength == -1) {
          var program = GL.programs[program];
          var numBlocks = GLctx.getProgramParameter(program, GLctx.ACTIVE_UNIFORM_BLOCKS);
          ptable.maxUniformBlockNameLength = 0;
          for (var i = 0; i < numBlocks; ++i) {
            var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
            ptable.maxUniformBlockNameLength = Math.max(ptable.maxAttributeLength, activeBlockName.length+1);
          }
        }
        HEAP32[((p)>>2)]=ptable.maxUniformBlockNameLength;
      } else {
        HEAP32[((p)>>2)]=GLctx.getProgramParameter(GL.programs[program], pname);
      }
    }

  
  function __ZSt18uncaught_exceptionv() { // std::uncaught_exception()
      return !!__ZSt18uncaught_exceptionv.uncaught_exception;
    }
  
  
  
  var EXCEPTIONS={last:0,caught:[],infos:{},deAdjust:function (adjusted) {
        if (!adjusted || EXCEPTIONS.infos[adjusted]) return adjusted;
        for (var ptr in EXCEPTIONS.infos) {
          var info = EXCEPTIONS.infos[ptr];
          if (info.adjusted === adjusted) {
            return ptr;
          }
        }
        return adjusted;
      },addRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount++;
      },decRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        assert(info.refcount > 0);
        info.refcount--;
        // A rethrown exception can reach refcount 0; it must not be discarded
        // Its next handler will clear the rethrown flag and addRef it, prior to
        // final decRef and destruction here
        if (info.refcount === 0 && !info.rethrown) {
          if (info.destructor) {
            Runtime.dynCall('vi', info.destructor, [ptr]);
          }
          delete EXCEPTIONS.infos[ptr];
          ___cxa_free_exception(ptr);
        }
      },clearRef:function (ptr) {
        if (!ptr) return;
        var info = EXCEPTIONS.infos[ptr];
        info.refcount = 0;
      }};
  function ___resumeException(ptr) {
      if (!EXCEPTIONS.last) { EXCEPTIONS.last = ptr; }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }function ___cxa_find_matching_catch() {
      var thrown = EXCEPTIONS.last;
      if (!thrown) {
        // just pass through the null ptr
        return ((asm["setTempRet0"](0),0)|0);
      }
      var info = EXCEPTIONS.infos[thrown];
      var throwntype = info.type;
      if (!throwntype) {
        // just pass through the thrown ptr
        return ((asm["setTempRet0"](0),thrown)|0);
      }
      var typeArray = Array.prototype.slice.call(arguments);
  
      var pointer = Module['___cxa_is_pointer_type'](throwntype);
      // can_catch receives a **, add indirection
      if (!___cxa_find_matching_catch.buffer) ___cxa_find_matching_catch.buffer = _malloc(4);
      HEAP32[((___cxa_find_matching_catch.buffer)>>2)]=thrown;
      thrown = ___cxa_find_matching_catch.buffer;
      // The different catch blocks are denoted by different types.
      // Due to inheritance, those types may not precisely match the
      // type of the thrown object. Find one which matches, and
      // return the type of the catch block which should be called.
      for (var i = 0; i < typeArray.length; i++) {
        if (typeArray[i] && Module['___cxa_can_catch'](typeArray[i], throwntype, thrown)) {
          thrown = HEAP32[((thrown)>>2)]; // undo indirection
          info.adjusted = thrown;
          return ((asm["setTempRet0"](typeArray[i]),thrown)|0);
        }
      }
      // Shouldn't happen unless we have bogus data in typeArray
      // or encounter a type for which emscripten doesn't have suitable
      // typeinfo defined. Best-efforts match just in case.
      thrown = HEAP32[((thrown)>>2)]; // undo indirection
      return ((asm["setTempRet0"](throwntype),thrown)|0);
    }function ___gxx_personality_v0() {
    }

  function _emscripten_set_mouseleave_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave");
      return 0;
    }

  function __emval_call_method(caller, handle, methodName, destructorsRef, args) {
      caller = emval_methodCallers[caller];
      handle = requireHandle(handle);
      methodName = getStringOrSymbol(methodName);
      return caller(handle, methodName, __emval_allocateDestructors(destructorsRef), args);
    }

  function _glGetUniformLocation(program, name) {
      name = Pointer_stringify(name);
  
      var arrayOffset = 0;
      // If user passed an array accessor "[index]", parse the array index off the accessor.
      if (name.indexOf(']', name.length-1) !== -1) {
        var ls = name.lastIndexOf('[');
        var arrayIndex = name.slice(ls+1, -1);
        if (arrayIndex.length > 0) {
          arrayOffset = parseInt(arrayIndex);
          if (arrayOffset < 0) {
            return -1;
          }
        }
        name = name.slice(0, ls);
      }
  
      var ptable = GL.programInfos[program];
      if (!ptable) {
        return -1;
      }
      var utable = ptable.uniforms;
      var uniformInfo = utable[name]; // returns pair [ dimension_of_uniform_array, uniform_location ]
      if (uniformInfo && arrayOffset < uniformInfo[0]) { // Check if user asked for an out-of-bounds element, i.e. for 'vec4 colors[3];' user could ask for 'colors[10]' which should return -1.
        return uniformInfo[1]+arrayOffset;
      } else {
        return -1;
      }
    }

  function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
  
      if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _glBindFramebuffer(target, framebuffer) {
      GLctx.bindFramebuffer(target, framebuffer ? GL.framebuffers[framebuffer] : null);
    }

  function _workerMode() {
      return tulip.workerMode;
    }

  function _glCullFace(x0) { GLctx['cullFace'](x0) }

  function _glUniform4fv(location, count, value) {
      location = GL.uniforms[location];
      var view;
      if (4*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[4*count-1];
        for (var i = 0; i < 4*count; i += 4) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*16)>>2);
      }
      GLctx.uniform4fv(location, view);
    }

  function _clock() {
      if (_clock.start === undefined) _clock.start = Date.now();
      return ((Date.now() - _clock.start) * (1000000 / 1000))|0;
    }

  var _llvm_ctlz_i32=true;

  function _emscripten_webgl_make_context_current(contextHandle) {
      var success = GL.makeContextCurrent(contextHandle);
      return success ? 0 : -5;
    }

  function _glDeleteProgram(id) {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) { // glDeleteProgram actually signals an error when deleting a nonexisting object, unlike some other GL delete functions.
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
      GL.programInfos[id] = null;
    }

  
  function __exit(status) {
      // void _exit(int status);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/exit.html
      Module['exit'](status);
    }function _exit(status) {
      __exit(status);
    }

  
  var PTHREAD_SPECIFIC={};function _pthread_setspecific(key, value) {
      if (!(key in PTHREAD_SPECIFIC)) {
        return ERRNO_CODES.EINVAL;
      }
      PTHREAD_SPECIFIC[key] = value;
      return 0;
    }

  function _glRenderbufferStorage(x0, x1, x2, x3) { GLctx['renderbufferStorage'](x0, x1, x2, x3) }

  function _glAttachShader(program, shader) {
      GLctx.attachShader(GL.programs[program],
                              GL.shaders[shader]);
    }

  function _glCheckFramebufferStatus(x0) { return GLctx['checkFramebufferStatus'](x0) }

  function _emscripten_set_mousemove_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove");
      return 0;
    }

  
  function _embind_repr(v) {
      if (v === null) {
          return 'null';
      }
      var t = typeof v;
      if (t === 'object' || t === 'array' || t === 'function') {
          return v.toString();
      } else {
          return '' + v;
      }
    }
  
  function floatReadValueFromPointer(name, shift) {
      switch (shift) {
          case 2: return function(pointer) {
              return this['fromWireType'](HEAPF32[pointer >> 2]);
          };
          case 3: return function(pointer) {
              return this['fromWireType'](HEAPF64[pointer >> 3]);
          };
          default:
              throw new TypeError("Unknown float type: " + name);
      }
    }
  
  function getShiftFromSize(size) {
      switch (size) {
          case 1: return 0;
          case 2: return 1;
          case 4: return 2;
          case 8: return 3;
          default:
              throw new TypeError('Unknown type size: ' + size);
      }
    }function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              return value;
          },
          'toWireType': function(destructors, value) {
              // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
              // avoid the following if() and assume value is of proper type.
              if (typeof value !== "number" && typeof value !== "boolean") {
                  throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
              }
              return value;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': floatReadValueFromPointer(name, shift),
          destructorFunction: null, // This type does not need a destructor
      });
    }

  function ___syscall10(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // unlink
      var path = SYSCALLS.getStr();
      FS.unlink(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function _glGetBufferParameteriv(target, value, data) {
      if (!data) {
        // GLES2 specification does not specify how to behave if data is a null pointer. Since calling this function does not make sense
        // if data == null, issue a GL error to notify user about it. 
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      HEAP32[((data)>>2)]=GLctx.getBufferParameter(target, value);
    }

  function _glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) { GLctx['copyTexImage2D'](x0, x1, x2, x3, x4, x5, x6, x7) }

  function _glDrawElements(mode, count, type, indices) {
  
      GLctx.drawElements(mode, count, type, indices);
  
    }

  function _emscripten_webgl_init_context_attributes(attributes) {
      HEAP32[((attributes)>>2)]=1;
      HEAP32[(((attributes)+(4))>>2)]=1;
      HEAP32[(((attributes)+(8))>>2)]=0;
      HEAP32[(((attributes)+(12))>>2)]=1;
      HEAP32[(((attributes)+(16))>>2)]=1;
      HEAP32[(((attributes)+(20))>>2)]=0;
      HEAP32[(((attributes)+(24))>>2)]=0;
      HEAP32[(((attributes)+(28))>>2)]=0;
      HEAP32[(((attributes)+(32))>>2)]=1;
      HEAP32[(((attributes)+(36))>>2)]=0;
      HEAP32[(((attributes)+(40))>>2)]=1;
      HEAP32[(((attributes)+(44))>>2)]=0;
    }

  function ___syscall3(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // read
      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
      return FS.read(stream, HEAP8,buf, count);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall5(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // open
      var pathname = SYSCALLS.getStr(), flags = SYSCALLS.get(), mode = SYSCALLS.get() // optional TODO
      var stream = FS.open(pathname, flags, mode);
      return stream.fd;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall4(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // write
      var stream = SYSCALLS.getStreamFromFD(), buf = SYSCALLS.get(), count = SYSCALLS.get();
      return FS.write(stream, HEAP8,buf, count);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___syscall6(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // close
      var stream = SYSCALLS.getStreamFromFD();
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }


  function _glBufferSubData(target, offset, size, data) {
      GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data+size));
    }

  function _glBindAttribLocation(program, index, name) {
      name = Pointer_stringify(name);
      GLctx.bindAttribLocation(GL.programs[program], index, name);
    }

  function _loadImageFromUrl(url, imageLoadedCallback, errorCallback) {
  
      if (!TulipUtils.textureCanvas) {
        TulipUtils.textureCanvas = document.createElement('canvas');
      }
  
      var img = new Image,
        canvas = TulipUtils.textureCanvas,
        ctx = canvas.getContext('2d'),
        src = Pointer_stringify(url);
  
      img.crossOrigin = 'anonymous';
  
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
        ctx.drawImage( img, 0, 0 );
        var imageData = ctx.getImageData(0, 0, img.width, img.height);
        var nDataBytes = img.width * img.height * 4 * Uint8ClampedArray.BYTES_PER_ELEMENT;
        var dataPtr = Module._malloc(nDataBytes);
        var imageDataHeap = new Uint8ClampedArray(Module.HEAPU8.buffer, dataPtr, img.width * img.height * 4);
        imageDataHeap.set(imageData.data);
        Runtime.dynCall('viiii', imageLoadedCallback, [url, imageDataHeap.byteOffset, img.width, img.height]);
        Module._free(imageDataHeap.byteOffset);
      };
      img.onerror = function() {
        Runtime.dynCall('viii', errorCallback, [0, url, 0]);
      };
      img.src = src;
      if (img.complete || img.complete === undefined) {
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
        img.src = src;
      }
    }

  function _times(buffer) {
      // clock_t times(struct tms *buffer);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/times.html
      // NOTE: This is fake, since we can't calculate real CPU time usage in JS.
      if (buffer !== 0) {
        _memset(buffer, 0, 16);
      }
      return 0;
    }

  function _glGenerateMipmap(x0) { GLctx['generateMipmap'](x0) }

  function ___syscall40(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // rmdir
      var path = SYSCALLS.getStr();
      FS.rmdir(path);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function _focusCanvas(canvasId) {
      var canvas = document.getElementById(Pointer_stringify(canvasId));
      if (!canvas) return;
      var oldPos = canvas.style.position;
      canvas.style.position = 'fixed';
      canvas.focus();
      canvas.style.position = oldPos;
    }

  function _glGetShaderiv(shader, pname, p) {
      if (!p) {
        // GLES2 specification does not specify how to behave if p is a null pointer. Since calling this function does not make sense
        // if p == null, issue a GL error to notify user about it. 
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      if (pname == 0x8B84) { // GL_INFO_LOG_LENGTH
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        HEAP32[((p)>>2)]=log.length + 1;
      } else {
        HEAP32[((p)>>2)]=GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    }

  function _setProgressBarCommentWorker(graphId, text) {
      tulip.sendProgressComment(graphId, Pointer_stringify(text));
    }

  function ___syscall146(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // writev
      var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      return SYSCALLS.doWritev(stream, iov, iovcnt);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]);
      return sum;
    }
  
  
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month 
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
  
      var tm_zone = HEAP32[(((tm)+(40))>>2)];
  
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)],
        tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
        tm_zone: tm_zone ? Pointer_stringify(tm_zone) : ''
      };
  
      var pattern = Pointer_stringify(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S'                  // Replaced by the locale's appropriate date representation
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      };
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      };
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        };
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      };
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      };
  
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else { 
            return thisDate.getFullYear()-1;
          }
      };
  
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year. 
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes 
          // January 4th, which is also the week that includes the first Thursday of the year, and 
          // is also the first week that contains at least four days in the year. 
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of 
          // the last week of the preceding year; thus, for Saturday 2nd January 1999, 
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th, 
          // or 31st is a Monday, it and any following days are part of week 1 of the following year. 
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
          
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay() || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Sunday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
          
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
  
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week) 
          // as a decimal number [01,53]. If the week containing 1 January has four 
          // or more days in the new year, then it is considered week 1. 
          // Otherwise, it is the last week of the previous year, and the next week is week 1. 
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          } 
  
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
  
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          var day = new Date(date.tm_year+1900, date.tm_mon+1, date.tm_mday, 0, 0, 0, 0);
          return day.getDay();
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53]. 
          // The first Monday of January is the first day of week 1; 
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          // convert from minutes into hhmm format (which means 60 minutes = 100 units)
          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': function(date) {
          return date.tm_zone;
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      } 
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }

  function ___syscall145(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // readv
      var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
      return SYSCALLS.doReadv(stream, iov, iovcnt);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  
  function _atexit(func, arg) {
      __ATEXIT__.unshift({ func: func, arg: arg });
    }function ___cxa_atexit() {
  return _atexit.apply(null, arguments)
  }

  function __emval_new_cstring(v) {
      return __emval_register(getStringOrSymbol(v));
    }

  
  function __emval_addMethodCaller(caller) {
      var id = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id;
    }
  
  function __emval_lookupTypes(argCount, argTypes, argWireTypes) {
      var a = new Array(argCount);
      for (var i = 0; i < argCount; ++i) {
          a[i] = requireRegisteredType(
              HEAP32[(argTypes >> 2) + i],
              "parameter " + i);
      }
      return a;
    }
  
  function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
          throw new TypeError('new_ called with constructor type ' + typeof(constructor) + " which is not a function");
      }
  
      /*
       * Previously, the following line was just:
  
       function dummy() {};
  
       * Unfortunately, Chrome was preserving 'dummy' as the object's name, even though at creation, the 'dummy' has the
       * correct constructor name.  Thus, objects created with IMVU.new would show up in the debugger as 'dummy', which
       * isn't very helpful.  Using IMVU.createNamedFunction addresses the issue.  Doublely-unfortunately, there's no way
       * to write a test for this behavior.  -NRD 2013.02.22
       */
      var dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function(){});
      dummy.prototype = constructor.prototype;
      var obj = new dummy;
  
      var r = constructor.apply(obj, argumentList);
      return (r instanceof Object) ? r : obj;
    }function __emval_get_method_caller(argCount, argTypes) {
      var types = __emval_lookupTypes(argCount, argTypes);
  
      var retType = types[0];
      var signatureName = retType.name + "_$" + types.slice(1).map(function (t) { return t.name; }).join("_") + "$";
  
      var params = ["retType"];
      var args = [retType];
  
      var argsList = ""; // 'arg0, arg1, arg2, ... , argN'
      for (var i = 0; i < argCount - 1; ++i) {
          argsList += (i !== 0 ? ", " : "") + "arg" + i;
          params.push("argType" + i);
          args.push(types[1 + i]);
      }
  
      var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
      var functionBody =
          "return function " + functionName + "(handle, name, destructors, args) {\n";
  
      var offset = 0;
      for (var i = 0; i < argCount - 1; ++i) {
          functionBody +=
          "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset ? ("+"+offset) : "") + ");\n";
          offset += types[i + 1]['argPackAdvance'];
      }
      functionBody +=
          "    var rv = handle[name](" + argsList + ");\n";
      for (var i = 0; i < argCount - 1; ++i) {
          if (types[i + 1]['deleteObject']) {
              functionBody +=
              "    argType" + i + ".deleteObject(arg" + i + ");\n";
          }
      }
      if (!retType.isVoid) {
          functionBody +=
          "    return retType.toWireType(destructors, rv);\n";
      }
      functionBody += 
          "};\n";
  
      params.push(functionBody);
      var invokerFunction = new_(Function, params).apply(null, args);
      return __emval_addMethodCaller(invokerFunction);
    }

  function ___cxa_throw(ptr, type, destructor) {
      EXCEPTIONS.infos[ptr] = {
        ptr: ptr,
        adjusted: ptr,
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
      };
      EXCEPTIONS.last = ptr;
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exception = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exception++;
      }
      throw ptr + " - Exception catching is disabled, this exception cannot be caught. Compile with -s DISABLE_EXCEPTION_CATCHING=0 or DISABLE_EXCEPTION_CATCHING=2 to catch.";
    }

  function ___cxa_begin_catch(ptr) {
      var info = EXCEPTIONS.infos[ptr];
      if (info && !info.caught) {
        info.caught = true;
        __ZSt18uncaught_exceptionv.uncaught_exception--;
      }
      if (info) info.rethrown = false;
      EXCEPTIONS.caught.push(ptr);
      EXCEPTIONS.addRef(EXCEPTIONS.deAdjust(ptr));
      return ptr;
    }

  function _pthread_cleanup_pop() {
      assert(_pthread_cleanup_push.level == __ATEXIT__.length, 'cannot pop if something else added meanwhile!');
      __ATEXIT__.pop();
      _pthread_cleanup_push.level = __ATEXIT__.length;
    }

  function _glDisableVertexAttribArray(index) {
      GLctx.disableVertexAttribArray(index);
    }

  
  function integerReadValueFromPointer(name, shift, signed) {
      // integers are quite common, so generate very specialized functions
      switch (shift) {
          case 0: return signed ?
              function readS8FromPointer(pointer) { return HEAP8[pointer]; } :
              function readU8FromPointer(pointer) { return HEAPU8[pointer]; };
          case 1: return signed ?
              function readS16FromPointer(pointer) { return HEAP16[pointer >> 1]; } :
              function readU16FromPointer(pointer) { return HEAPU16[pointer >> 1]; };
          case 2: return signed ?
              function readS32FromPointer(pointer) { return HEAP32[pointer >> 2]; } :
              function readU32FromPointer(pointer) { return HEAPU32[pointer >> 2]; };
          default:
              throw new TypeError("Unknown integer type: " + name);
      }
    }function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
      name = readLatin1String(name);
      if (maxRange === -1) { // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come out as 'i32 -1'. Always treat those as max u32.
          maxRange = 4294967295;
      }
  
      var shift = getShiftFromSize(size);
      
      var fromWireType = function(value) {
          return value;
      };
      
      if (minRange === 0) {
          var bitshift = 32 - 8*size;
          fromWireType = function(value) {
              return (value << bitshift) >>> bitshift;
          };
      }
  
      registerType(primitiveType, {
          name: name,
          'fromWireType': fromWireType,
          'toWireType': function(destructors, value) {
              // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
              // avoid the following two if()s and assume value is of proper type.
              if (typeof value !== "number" && typeof value !== "boolean") {
                  throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
              }
              if (value < minRange || value > maxRange) {
                  throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ', ' + maxRange + ']!');
              }
              return value | 0;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': integerReadValueFromPointer(name, shift, minRange !== 0),
          destructorFunction: null, // This type does not need a destructor
      });
    }

  function _glBindRenderbuffer(target, renderbuffer) {
      GLctx.bindRenderbuffer(target, renderbuffer ? GL.renderbuffers[renderbuffer] : null);
    }

  function _pthread_create() {
      return 11;
    }

  function _pthread_mutex_init() {}

  function _glDeleteFramebuffers(n, framebuffers) {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(((framebuffers)+(i*4))>>2)];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue; // GL spec: "glDeleteFramebuffers silently ignores 0s and names that do not correspond to existing framebuffer objects".
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    }

  function _glDrawArrays(mode, first, count) {
  
      GLctx.drawArrays(mode, first, count);
  
    }


  
  function _realloc() { throw 'bad' }
  Module["_realloc"] = _realloc; 
  Module["_saveSetjmp"] = _saveSetjmp;

  function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 85: return totalMemory / PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 79:
          return 0;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: {
          if (typeof navigator === 'object') return navigator['hardwareConcurrency'] || 1;
          return 1;
        }
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  function _emscripten_set_keypress_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress");
      return 0;
    }

  
  var PTHREAD_SPECIFIC_NEXT_KEY=1;function _pthread_key_create(key, destructor) {
      if (key == 0) {
        return ERRNO_CODES.EINVAL;
      }
      HEAP32[((key)>>2)]=PTHREAD_SPECIFIC_NEXT_KEY;
      // values start at 0
      PTHREAD_SPECIFIC[PTHREAD_SPECIFIC_NEXT_KEY] = 0;
      PTHREAD_SPECIFIC_NEXT_KEY++;
      return 0;
    }

  function _glClear(x0) { GLctx['clear'](x0) }

  function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          isVoid: true, // void return values can be optimized out sometimes
          name: name,
          'argPackAdvance': 0,
          'fromWireType': function() {
              return undefined;
          },
          'toWireType': function(destructors, o) {
              // TODO: assert if anything else is given?
              return undefined;
          },
      });
    }

  function _glActiveTexture(x0) { GLctx['activeTexture'](x0) }

  function _glEnableVertexAttribArray(index) {
      GLctx.enableVertexAttribArray(index);
    }

  function _glBindBuffer(target, buffer) {
      var bufferObj = buffer ? GL.buffers[buffer] : null;
  
  
      GLctx.bindBuffer(target, bufferObj);
    }

  function _glStencilOp(x0, x1, x2) { GLctx['stencilOp'](x0, x1, x2) }

  function _resizeWebGLCanvas(canvasId, width, height, sizeRelativeToContainer) {
      Module['canvas'] = document.getElementById(Pointer_stringify(canvasId));
      if (!sizeRelativeToContainer) {
        Browser.setCanvasSize(width, height);
      } else {
        Module['canvas'].width = width;
        Module['canvas'].height = height;
      }
    }

  function _glDepthRange(x0, x1) { GLctx['depthRange'](x0, x1) }

  function _glUniform4f(location, v0, v1, v2, v3) {
      location = GL.uniforms[location];
      GLctx.uniform4f(location, v0, v1, v2, v3);
    }

  function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
      GLctx.framebufferTexture2D(target, attachment, textarget,
                                      GL.textures[texture], level);
    }

  function ___syscall77(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getrusage
      var who = SYSCALLS.get(), usage = SYSCALLS.get();
      _memset(usage, 0, 136);
      HEAP32[((usage)>>2)]=1; // fake some values
      HEAP32[(((usage)+(4))>>2)]=2;
      HEAP32[(((usage)+(8))>>2)]=3;
      HEAP32[(((usage)+(12))>>2)]=4;
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function __emval_new_array() {
      return __emval_register([]);
    }

  function _glUniform3fv(location, count, value) {
      location = GL.uniforms[location];
      var view;
      if (3*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[3*count-1];
        for (var i = 0; i < 3*count; i += 3) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*12)>>2);
      }
      GLctx.uniform3fv(location, view);
    }

  function _glBufferData(target, size, data, usage) {
      switch (usage) { // fix usages, WebGL only has *_DRAW
        case 0x88E1: // GL_STREAM_READ
        case 0x88E2: // GL_STREAM_COPY
          usage = 0x88E0; // GL_STREAM_DRAW
          break;
        case 0x88E5: // GL_STATIC_READ
        case 0x88E6: // GL_STATIC_COPY
          usage = 0x88E4; // GL_STATIC_DRAW
          break;
        case 0x88E9: // GL_DYNAMIC_READ
        case 0x88EA: // GL_DYNAMIC_COPY
          usage = 0x88E8; // GL_DYNAMIC_DRAW
          break;
      }
      if (!data) {
        GLctx.bufferData(target, size, usage);
      } else {
        GLctx.bufferData(target, HEAPU8.subarray(data, data+size), usage);
      }
    }

   
  Module["_pthread_cond_broadcast"] = _pthread_cond_broadcast;

  
  
   
  Module["_testSetjmp"] = _testSetjmp;function _longjmp(env, value) {
      asm['setThrew'](env, value || 1);
      throw 'longjmp';
    }function _emscripten_longjmp(env, value) {
      _longjmp(env, value);
    }

  
  
  
  
  var _environ=STATICTOP; STATICTOP += 16;;var ___environ=_environ;function ___buildEnvironment(env) {
      // WARNING: Arbitrary limit!
      var MAX_ENV_VALUES = 64;
      var TOTAL_ENV_SIZE = 1024;
  
      // Statically allocate memory for the environment.
      var poolPtr;
      var envPtr;
      if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        // Set default values. Use string keys for Closure Compiler compatibility.
        ENV['USER'] = ENV['LOGNAME'] = 'web_user';
        ENV['PATH'] = '/';
        ENV['PWD'] = '/';
        ENV['HOME'] = '/home/web_user';
        ENV['LANG'] = 'C';
        ENV['_'] = Module['thisProgram'];
        // Allocate memory.
        poolPtr = allocate(TOTAL_ENV_SIZE, 'i8', ALLOC_STATIC);
        envPtr = allocate(MAX_ENV_VALUES * 4,
                          'i8*', ALLOC_STATIC);
        HEAP32[((envPtr)>>2)]=poolPtr;
        HEAP32[((_environ)>>2)]=envPtr;
      } else {
        envPtr = HEAP32[((_environ)>>2)];
        poolPtr = HEAP32[((envPtr)>>2)];
      }
  
      // Collect key=value lines.
      var strings = [];
      var totalSize = 0;
      for (var key in env) {
        if (typeof env[key] === 'string') {
          var line = key + '=' + env[key];
          strings.push(line);
          totalSize += line.length;
        }
      }
      if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error('Environment size exceeded TOTAL_ENV_SIZE!');
      }
  
      // Make new.
      var ptrSize = 4;
      for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[(((envPtr)+(i * ptrSize))>>2)]=poolPtr;
        poolPtr += line.length + 1;
      }
      HEAP32[(((envPtr)+(strings.length * ptrSize))>>2)]=0;
    }var ENV={};function _getenv(name) {
      // char *getenv(const char *name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/getenv.html
      if (name === 0) return 0;
      name = Pointer_stringify(name);
      if (!ENV.hasOwnProperty(name)) return 0;
  
      if (_getenv.ret) _free(_getenv.ret);
      _getenv.ret = allocate(intArrayFromString(ENV[name]), 'i8', ALLOC_NORMAL);
      return _getenv.ret;
    }

  function _emscripten_webgl_create_context(target, attributes) {
      var contextAttributes = {};
      contextAttributes['alpha'] = !!HEAP32[((attributes)>>2)];
      contextAttributes['depth'] = !!HEAP32[(((attributes)+(4))>>2)];
      contextAttributes['stencil'] = !!HEAP32[(((attributes)+(8))>>2)];
      contextAttributes['antialias'] = !!HEAP32[(((attributes)+(12))>>2)];
      contextAttributes['premultipliedAlpha'] = !!HEAP32[(((attributes)+(16))>>2)];
      contextAttributes['preserveDrawingBuffer'] = !!HEAP32[(((attributes)+(20))>>2)];
      contextAttributes['preferLowPowerToHighPerformance'] = !!HEAP32[(((attributes)+(24))>>2)];
      contextAttributes['failIfMajorPerformanceCaveat'] = !!HEAP32[(((attributes)+(28))>>2)];
      contextAttributes['majorVersion'] = HEAP32[(((attributes)+(32))>>2)];
      contextAttributes['minorVersion'] = HEAP32[(((attributes)+(36))>>2)];
      var enableExtensionsByDefault = HEAP32[(((attributes)+(40))>>2)];
      contextAttributes['explicitSwapControl'] = HEAP32[(((attributes)+(44))>>2)];
  
      target = Pointer_stringify(target);
      var canvas;
      if ((!target || target === '#canvas') && Module['canvas']) {
        canvas = Module['canvas'].id ? (GL.offscreenCanvases[Module['canvas'].id] || JSEvents.findEventTarget(Module['canvas'].id)) : Module['canvas'];
      } else {
        canvas = GL.offscreenCanvases[target] || JSEvents.findEventTarget(target);
      }
      if (!canvas) {
        return 0;
      }
      if (contextAttributes['explicitSwapControl']) {
        console.error('emscripten_webgl_create_context failed: explicitSwapControl is not supported, please rebuild with -s OFFSCREENCANVAS_SUPPORT=1 to enable targeting the experimental OffscreenCanvas specification!');
        return 0;
      }
  
      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    }

  function _glGetError() {
      // First return any GL error generated by the emscripten library_gl.js interop layer.
      if (GL.lastError) {
        var error = GL.lastError;
        GL.lastError = 0/*GL_NO_ERROR*/;
        return error;
      } else { // If there were none, return the GL error from the browser GL context.
        return GLctx.getError();
      }
    }

  function _glDeleteRenderbuffers(n, renderbuffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((renderbuffers)+(i*4))>>2)];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue; // GL spec: "glDeleteRenderbuffers silently ignores 0s and names that do not correspond to existing renderbuffer objects".
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    }

   
  Module["_pthread_mutex_unlock"] = _pthread_mutex_unlock;

  function _glewGetErrorString(error) {
      return GLEW.errorString(error);
    }

  function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    }

  function _glReadPixels(x, y, width, height, format, type, pixels) {
      var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
      if (!pixelData) {
        GL.recordError(0x0500/*GL_INVALID_ENUM*/);
        return;
      }
      GLctx.readPixels(x, y, width, height, format, type, pixelData);
    }

  function _glUseProgram(program) {
      GLctx.useProgram(program ? GL.programs[program] : null);
    }

  function _glGenFramebuffers(n, ids) {
      for (var i = 0; i < n; ++i) {
        var framebuffer = GLctx.createFramebuffer();
        if (!framebuffer) {
          GL.recordError(0x0502 /* GL_INVALID_OPERATION */);
          while(i < n) HEAP32[(((ids)+(i++*4))>>2)]=0;
          return;
        }
        var id = GL.getNewId(GL.framebuffers);
        framebuffer.name = id;
        GL.framebuffers[id] = framebuffer;
        HEAP32[(((ids)+(i*4))>>2)]=id;
      }
    }

  var _llvm_pow_f64=Math_pow;

   
  Module["_sbrk"] = _sbrk;


  function _glStencilFunc(x0, x1, x2) { GLctx['stencilFunc'](x0, x1, x2) }

  
  function emscriptenWebGLGet(name_, p, type) {
      // Guard against user passing a null pointer.
      // Note that GLES2 spec does not say anything about how passing a null pointer should be treated.
      // Testing on desktop core GL 3, the application crashes on glGetIntegerv to a null pointer, but
      // better to report an error instead of doing anything random.
      if (!p) {
        GL.recordError(0x0501 /* GL_INVALID_VALUE */);
        return;
      }
      var ret = undefined;
      switch(name_) { // Handle a few trivial GLES values
        case 0x8DFA: // GL_SHADER_COMPILER
          ret = 1;
          break;
        case 0x8DF8: // GL_SHADER_BINARY_FORMATS
          if (type !== 'Integer' && type !== 'Integer64') {
            GL.recordError(0x0500); // GL_INVALID_ENUM
          }
          return; // Do not write anything to the out pointer, since no binary formats are supported.
        case 0x8DF9: // GL_NUM_SHADER_BINARY_FORMATS
          ret = 0;
          break;
        case 0x86A2: // GL_NUM_COMPRESSED_TEXTURE_FORMATS
          // WebGL doesn't have GL_NUM_COMPRESSED_TEXTURE_FORMATS (it's obsolete since GL_COMPRESSED_TEXTURE_FORMATS returns a JS array that can be queried for length),
          // so implement it ourselves to allow C++ GLES2 code get the length.
          var formats = GLctx.getParameter(0x86A3 /*GL_COMPRESSED_TEXTURE_FORMATS*/);
          ret = formats.length;
          break;
      }
  
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof(result)) {
          case "number":
            ret = result;
            break;
          case "boolean":
            ret = result ? 1 : 0;
            break;
          case "string":
            GL.recordError(0x0500); // GL_INVALID_ENUM
            return;
          case "object":
            if (result === null) {
              // null is a valid result for some (e.g., which buffer is bound - perhaps nothing is bound), but otherwise
              // can mean an invalid name_, which we need to report as an error
              switch(name_) {
                case 0x8894: // ARRAY_BUFFER_BINDING
                case 0x8B8D: // CURRENT_PROGRAM
                case 0x8895: // ELEMENT_ARRAY_BUFFER_BINDING
                case 0x8CA6: // FRAMEBUFFER_BINDING
                case 0x8CA7: // RENDERBUFFER_BINDING
                case 0x8069: // TEXTURE_BINDING_2D
                case 0x8514: { // TEXTURE_BINDING_CUBE_MAP
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(0x0500); // GL_INVALID_ENUM
                  return;
                }
              }
            } else if (result instanceof Float32Array ||
                       result instanceof Uint32Array ||
                       result instanceof Int32Array ||
                       result instanceof Array) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 'Integer': HEAP32[(((p)+(i*4))>>2)]=result[i];   break;
                  case 'Float':   HEAPF32[(((p)+(i*4))>>2)]=result[i]; break;
                  case 'Boolean': HEAP8[(((p)+(i))>>0)]=result[i] ? 1 : 0;    break;
                  default: throw 'internal glGet error, bad type: ' + type;
                }
              }
              return;
            } else if (result instanceof WebGLBuffer ||
                       result instanceof WebGLProgram ||
                       result instanceof WebGLFramebuffer ||
                       result instanceof WebGLRenderbuffer ||
                       result instanceof WebGLTexture) {
              ret = result.name | 0;
            } else {
              GL.recordError(0x0500); // GL_INVALID_ENUM
              return;
            }
            break;
          default:
            GL.recordError(0x0500); // GL_INVALID_ENUM
            return;
        }
      }
  
      switch (type) {
        case 'Integer64': (tempI64 = [ret>>>0,(tempDouble=ret,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((p)>>2)]=tempI64[0],HEAP32[(((p)+(4))>>2)]=tempI64[1]);    break;
        case 'Integer': HEAP32[((p)>>2)]=ret;    break;
        case 'Float':   HEAPF32[((p)>>2)]=ret;  break;
        case 'Boolean': HEAP8[((p)>>0)]=ret ? 1 : 0; break;
        default: throw 'internal glGet error, bad type: ' + type;
      }
    }function _glGetIntegerv(name_, p) {
      emscriptenWebGLGet(name_, p, 'Integer');
    }

  function _abort() {
      Module['abort']();
    }

   
  Module["_llvm_bswap_i32"] = _llvm_bswap_i32;

  function _glDepthMask(flag) {
      GLctx.depthMask(!!flag);
    }

  function _emscripten_run_script(ptr) {
      eval(Pointer_stringify(ptr));
    }

  function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
      var shift = getShiftFromSize(size);
  
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(wt) {
              // ambiguous emscripten ABI: sometimes return values are
              // true or false, and sometimes integers (0 or 1)
              return !!wt;
          },
          'toWireType': function(destructors, o) {
              return o ? trueValue : falseValue;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': function(pointer) {
              // TODO: if heap is fixed (like in asm.js) this could be executed outside
              var heap;
              if (size === 1) {
                  heap = HEAP8;
              } else if (size === 2) {
                  heap = HEAP16;
              } else if (size === 4) {
                  heap = HEAP32;
              } else {
                  throw new TypeError("Unknown boolean type size: " + name);
              }
              return this['fromWireType'](heap[pointer >> shift]);
          },
          destructorFunction: null, // This type does not need a destructor
      });
    }

  function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
      var pixelData = null;
      if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat);
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
    }

  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }

  function ___syscall63(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // dup2
      var old = SYSCALLS.getStreamFromFD(), suggestFD = SYSCALLS.get();
      if (old.fd === suggestFD) return suggestFD;
      return SYSCALLS.doDup(old.path, old.flags, suggestFD);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function _glStencilMask(x0) { GLctx['stencilMask'](x0) }

  function ___syscall39(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // mkdir
      var path = SYSCALLS.getStr(), mode = SYSCALLS.get();
      return SYSCALLS.doMkdir(path, mode);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      if (maxLength > 0 && infoLog) {
        var numBytesWrittenExclNull = stringToUTF8(log, infoLog, maxLength);
        if (length) HEAP32[((length)>>2)]=numBytesWrittenExclNull;
      } else {
        if (length) HEAP32[((length)>>2)]=0;
      }
    }

  function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm); // no locale support yet
    }

  function _pthread_mutex_destroy() {}

  function _glUniform1fv(location, count, value) {
      location = GL.uniforms[location];
      var view;
      if (count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[count-1];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*4)>>2);
      }
      GLctx.uniform1fv(location, view);
    }

  function _glDeleteBuffers(n, buffers) {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(((buffers)+(i*4))>>2)];
        var buffer = GL.buffers[id];
  
        // From spec: "glDeleteBuffers silently ignores 0's and names that do not
        // correspond to existing buffer objects."
        if (!buffer) continue;
  
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
  
        if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
        if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0;
      }
    }

  function _glDepthFunc(x0) { GLctx['depthFunc'](x0) }

  function _pthread_once(ptr, func) {
      if (!_pthread_once.seen) _pthread_once.seen = {};
      if (ptr in _pthread_once.seen) return;
      Runtime.dynCall('v', func);
      _pthread_once.seen[ptr] = 1;
    }

  function _glGetAttribLocation(program, name) {
      program = GL.programs[program];
      name = Pointer_stringify(name);
      return GLctx.getAttribLocation(program, name);
    }

  function ___unlock() {}

  function _pthread_getspecific(key) {
      return PTHREAD_SPECIFIC[key] || 0;
    }

  function _glEnable(x0) { GLctx['enable'](x0) }

  function _emscripten_set_mouseenter_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 33, "mouseenter");
      return 0;
    }

  function _requestFullScreenCanvas(canvasId) {
      TulipUtils.fullScreenCanvasId = Pointer_stringify(canvasId);
      var canvas = document.getElementById(TulipUtils.fullScreenCanvasId);
      TulipUtils.canvasFSOldWidth = canvas.width;
      TulipUtils.canvasFSOldHeight = canvas.height;
      document.addEventListener('fullscreenchange', TulipUtils.onFullScreenEventChange, true);
      document.addEventListener('mozfullscreenchange', TulipUtils.onFullScreenEventChange, true);
      document.addEventListener('webkitfullscreenchange', TulipUtils.onFullScreenEventChange, true);
      var RFS = canvas['requestFullscreen'] ||
          canvas['requestFullScreen'] ||
          canvas['mozRequestFullScreen'] ||
          canvas['webkitRequestFullScreen'] ||
          (function() {});
      RFS.apply(canvas, []);
    }

  function _glShaderSource(shader, count, string, length) {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    }

  function _glDrawElementsInstancedARB(mode, count, type, indices, primcount) {
      GLctx['drawElementsInstanced'](mode, count, type, indices, primcount);
    }

  function _glFinish() { GLctx['finish']() }

  function ___syscall330(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // dup3
      var old = SYSCALLS.getStreamFromFD(), suggestFD = SYSCALLS.get(), flags = SYSCALLS.get();
      assert(!flags);
      if (old.fd === suggestFD) return -ERRNO_CODES.EINVAL;
      return SYSCALLS.doDup(old.path, old.flags, suggestFD);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }

  function __emval_set_property(handle, key, value) {
      handle = requireHandle(handle);
      key = requireHandle(key);
      value = requireHandle(value);
      handle[key] = value;
    }

  function _glBlendFunc(x0, x1) { GLctx['blendFunc'](x0, x1) }

  function _glCreateProgram() {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      GL.programs[id] = program;
      return id;
    }

  function ___cxa_pure_virtual() {
      ABORT = true;
      throw 'Pure virtual function called!';
    }


  function _glPixelStorei(pname, param) {
      if (pname == 0x0D05 /* GL_PACK_ALIGNMENT */) {
        GL.packAlignment = param;
      } else if (pname == 0x0cf5 /* GL_UNPACK_ALIGNMENT */) {
        GL.unpackAlignment = param;
      }
      GLctx.pixelStorei(pname, param);
    }

  function _glViewport(x0, x1, x2, x3) { GLctx['viewport'](x0, x1, x2, x3) }

  function _emscripten_set_mousedown_callback(target, userData, useCapture, callbackfunc) {
      JSEvents.registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown");
      return 0;
    }

  function _refreshWebGLCanvas(drawFunc) {
      if (drawFunc && !TulipUtils.requestedAnimationFrame) {
        TulipUtils.requestedAnimationFrame = true;
        Browser.requestAnimationFrame(function() {
          Browser.mainLoop.runIter(function() {
            Runtime.dynCall('v', drawFunc);
            TulipUtils.requestedAnimationFrame = false;
          });
        });
      }
    }

  function ___syscall183(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // getcwd
      var buf = SYSCALLS.get(), size = SYSCALLS.get();
      if (size === 0) return -ERRNO_CODES.EINVAL;
      var cwd = FS.cwd();
      if (size < cwd.length + 1) return -ERRNO_CODES.ERANGE;
      writeAsciiToMemory(cwd, buf);
      return buf;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function _pthread_join() {}

  function _safeSetTimeout(msec, func, value) {
      Browser.safeSetTimeout(function() { Runtime.dynCall('vi', func, [value]); }, msec);
    }

  function _glUniformMatrix4fv(location, count, transpose, value) {
      location = GL.uniforms[location];
      var view;
      if (16*count <= GL.MINI_TEMP_BUFFER_SIZE) {
        // avoid allocation when uploading few enough uniforms
        view = GL.miniTempBufferViews[16*count-1];
        for (var i = 0; i < 16*count; i += 16) {
          view[i] = HEAPF32[(((value)+(4*i))>>2)];
          view[i+1] = HEAPF32[(((value)+(4*i+4))>>2)];
          view[i+2] = HEAPF32[(((value)+(4*i+8))>>2)];
          view[i+3] = HEAPF32[(((value)+(4*i+12))>>2)];
          view[i+4] = HEAPF32[(((value)+(4*i+16))>>2)];
          view[i+5] = HEAPF32[(((value)+(4*i+20))>>2)];
          view[i+6] = HEAPF32[(((value)+(4*i+24))>>2)];
          view[i+7] = HEAPF32[(((value)+(4*i+28))>>2)];
          view[i+8] = HEAPF32[(((value)+(4*i+32))>>2)];
          view[i+9] = HEAPF32[(((value)+(4*i+36))>>2)];
          view[i+10] = HEAPF32[(((value)+(4*i+40))>>2)];
          view[i+11] = HEAPF32[(((value)+(4*i+44))>>2)];
          view[i+12] = HEAPF32[(((value)+(4*i+48))>>2)];
          view[i+13] = HEAPF32[(((value)+(4*i+52))>>2)];
          view[i+14] = HEAPF32[(((value)+(4*i+56))>>2)];
          view[i+15] = HEAPF32[(((value)+(4*i+60))>>2)];
        }
      } else {
        view = HEAPF32.subarray((value)>>2,(value+count*64)>>2);
      }
      GLctx.uniformMatrix4fv(location, !!transpose, view);
    }

  
  
  
  function _emscripten_set_main_loop_timing(mode, value) {
      Browser.mainLoop.timingMode = mode;
      Browser.mainLoop.timingValue = value;
  
      if (!Browser.mainLoop.func) {
        return 1; // Return non-zero on failure, can't set timing mode when there is no main loop.
      }
  
      if (mode == 0 /*EM_TIMING_SETTIMEOUT*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
          var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now())|0;
          setTimeout(Browser.mainLoop.runner, timeUntilNextTick); // doing this each time means that on exception, we stop
        };
        Browser.mainLoop.method = 'timeout';
      } else if (mode == 1 /*EM_TIMING_RAF*/) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
          Browser.requestAnimationFrame(Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'rAF';
      } else if (mode == 2 /*EM_TIMING_SETIMMEDIATE*/) {
        if (!window['setImmediate']) {
          // Emulate setImmediate. (note: not a complete polyfill, we don't emulate clearImmediate() to keep code size to minimum, since not needed)
          var setImmediates = [];
          var emscriptenMainLoopMessageId = 'setimmediate';
          function Browser_setImmediate_messageHandler(event) {
            if (event.source === window && event.data === emscriptenMainLoopMessageId) {
              event.stopPropagation();
              setImmediates.shift()();
            }
          }
          window.addEventListener("message", Browser_setImmediate_messageHandler, true);
          window['setImmediate'] = function Browser_emulated_setImmediate(func) {
            setImmediates.push(func);
            if (ENVIRONMENT_IS_WORKER) {
              if (Module['setImmediates'] === undefined) Module['setImmediates'] = [];
              Module['setImmediates'].push(func);
              window.postMessage({target: emscriptenMainLoopMessageId}); // In --proxy-to-worker, route the message via proxyClient.js
            } else window.postMessage(emscriptenMainLoopMessageId, "*"); // On the main thread, can just send the message to itself.
          }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
          window['setImmediate'](Browser.mainLoop.runner);
        };
        Browser.mainLoop.method = 'immediate';
      }
      return 0;
    }function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
      Module['noExitRuntime'] = true;
  
      assert(!Browser.mainLoop.func, 'emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.');
  
      Browser.mainLoop.func = func;
      Browser.mainLoop.arg = arg;
  
      var browserIterationFunc;
      if (typeof arg !== 'undefined') {
        var argArray = [arg];
        browserIterationFunc = function() {
          Runtime.dynCall('vi', func, argArray);
        };
      } else {
        browserIterationFunc = function() {
          Runtime.dynCall('v', func);
        };
      }
  
      var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  
      Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
          var start = Date.now();
          var blocker = Browser.mainLoop.queue.shift();
          blocker.func(blocker.arg);
          if (Browser.mainLoop.remainingBlockers) {
            var remaining = Browser.mainLoop.remainingBlockers;
            var next = remaining%1 == 0 ? remaining-1 : Math.floor(remaining);
            if (blocker.counted) {
              Browser.mainLoop.remainingBlockers = next;
            } else {
              // not counted, but move the progress along a tiny bit
              next = next + 0.5; // do not steal all the next one's progress
              Browser.mainLoop.remainingBlockers = (8*remaining + next)/9;
            }
          }
          console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + ' ms'); //, left: ' + Browser.mainLoop.remainingBlockers);
          Browser.mainLoop.updateStatus();
          
          // catches pause/resume main loop from blocker execution
          if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
          
          setTimeout(Browser.mainLoop.runner, 0);
          return;
        }
  
        // catch pauses from non-main loop sources
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Implement very basic swap interval control
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1/*EM_TIMING_RAF*/ && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
          // Not the scheduled time to render this frame - skip.
          Browser.mainLoop.scheduler();
          return;
        } else if (Browser.mainLoop.timingMode == 0/*EM_TIMING_SETTIMEOUT*/) {
          Browser.mainLoop.tickStartTime = _emscripten_get_now();
        }
  
        // Signal GL rendering layer that processing of a new frame is about to start. This helps it optimize
        // VBO double-buffering and reduce GPU stalls.
  
  
        if (Browser.mainLoop.method === 'timeout' && Module.ctx) {
          Module.printErr('Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!');
          Browser.mainLoop.method = ''; // just warn once per call to set main loop
        }
  
        Browser.mainLoop.runIter(browserIterationFunc);
  
  
        // catch pauses from the main loop itself
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
  
        // Queue new audio data. This is important to be right after the main loop invocation, so that we will immediately be able
        // to queue the newest produced audio samples.
        // TODO: Consider adding pre- and post- rAF callbacks so that GL.newRenderingFrameStarted() and SDL.audio.queueNewAudioData()
        //       do not need to be hardcoded into this function, but can be more generic.
        if (typeof SDL === 'object' && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
  
        Browser.mainLoop.scheduler();
      }
  
      if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0/*EM_TIMING_SETTIMEOUT*/, 1000.0 / fps);
        else _emscripten_set_main_loop_timing(1/*EM_TIMING_RAF*/, 1); // Do rAF by rendering each frame (no decimating)
  
        Browser.mainLoop.scheduler();
      }
  
      if (simulateInfiniteLoop) {
        throw 'SimulateInfiniteLoop';
      }
    }var Browser={mainLoop:{scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function () {
          Browser.mainLoop.scheduler = null;
          Browser.mainLoop.currentlyRunningMainloop++; // Incrementing this signals the previous main loop that it's now become old, and it must return.
        },resume:function () {
          Browser.mainLoop.currentlyRunningMainloop++;
          var timingMode = Browser.mainLoop.timingMode;
          var timingValue = Browser.mainLoop.timingValue;
          var func = Browser.mainLoop.func;
          Browser.mainLoop.func = null;
          _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true /* do not set timing and call scheduler, we will do it on the next lines */);
          _emscripten_set_main_loop_timing(timingMode, timingValue);
          Browser.mainLoop.scheduler();
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        },runIter:function (func) {
          if (ABORT) return;
          if (Module['preMainLoop']) {
            var preRet = Module['preMainLoop']();
            if (preRet === false) {
              return; // |return false| skips a frame
            }
          }
          try {
            func();
          } catch (e) {
            if (e instanceof ExitStatus) {
              return;
            } else {
              if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
              throw e;
            }
          }
          if (Module['postMainLoop']) Module['postMainLoop']();
        }},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas ||
                                document['msPointerLockElement'] === canvas;
        }
        if (canvas) {
          // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
          // Module['forcedAspectRatio'] = 4 / 3;
          
          canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                      canvas['mozRequestPointerLock'] ||
                                      canvas['webkitRequestPointerLock'] ||
                                      canvas['msRequestPointerLock'] ||
                                      function(){};
          canvas.exitPointerLock = document['exitPointerLock'] ||
                                   document['mozExitPointerLock'] ||
                                   document['webkitExitPointerLock'] ||
                                   document['msExitPointerLock'] ||
                                   function(){}; // no-op if function does not exist
          canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
  
          document.addEventListener('pointerlockchange', pointerLockChange, false);
          document.addEventListener('mozpointerlockchange', pointerLockChange, false);
          document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
          document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
          if (Module['elementPointerLock']) {
            canvas.addEventListener("click", function(ev) {
              if (!Browser.pointerLock && canvas.requestPointerLock) {
                canvas.requestPointerLock();
                ev.preventDefault();
              }
            }, false);
          }
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx; // no need to recreate GL context if it's already been created for this canvas.
  
        var ctx;
        var contextHandle;
        if (useWebGL) {
          // For GLES2/desktop GL compatibility, adjust a few defaults to be different to WebGL defaults, so that they align better with the desktop defaults.
          var contextAttributes = {
            antialias: false,
            alpha: false
          };
  
          if (webGLContextAttributes) {
            for (var attribute in webGLContextAttributes) {
              contextAttributes[attribute] = webGLContextAttributes[attribute];
            }
          }
  
          contextHandle = GL.createContext(canvas, contextAttributes);
          if (contextHandle) {
            ctx = GL.getContext(contextHandle).GLctx;
          }
        } else {
          ctx = canvas.getContext('2d');
        }
  
        if (!ctx) return null;
  
        if (setInModule) {
          if (!useWebGL) assert(typeof GLctx === 'undefined', 'cannot set in module if GLctx is used, but we are a non-GL context that would replace it');
  
          Module.ctx = ctx;
          if (useWebGL) GL.makeContextCurrent(contextHandle);
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function (lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === 'undefined') Browser.vrDevice = null;
  
        var canvas = Module['canvas'];
        function fullscreenChange() {
          Browser.isFullscreen = false;
          var canvasContainer = canvas.parentNode;
          if ((document['fullscreenElement'] || document['mozFullScreenElement'] ||
               document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.exitFullscreen = document['exitFullscreen'] ||
                                    document['cancelFullScreen'] ||
                                    document['mozCancelFullScreen'] ||
                                    document['msExitFullscreen'] ||
                                    document['webkitCancelFullScreen'] ||
                                    function() {};
            canvas.exitFullscreen = canvas.exitFullscreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullscreen = true;
            if (Browser.resizeCanvas) Browser.setFullscreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullscreen);
          if (Module['onFullscreen']) Module['onFullscreen'](Browser.isFullscreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullscreenHandlersInstalled) {
          Browser.fullscreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullscreenChange, false);
          document.addEventListener('mozfullscreenchange', fullscreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullscreenChange, false);
          document.addEventListener('MSFullscreenChange', fullscreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
  
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullscreen = canvasContainer['requestFullscreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullscreen'] ? function() { canvasContainer['webkitRequestFullscreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null) ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
  
        if (vrDevice) {
          canvasContainer.requestFullscreen({ vrDisplay: vrDevice });
        } else {
          canvasContainer.requestFullscreen();
        }
      },requestFullScreen:function (lockPointer, resizeCanvas, vrDevice) {
          Module.printErr('Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.');
          Browser.requestFullScreen = function(lockPointer, resizeCanvas, vrDevice) {
            return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
          }
          return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice);
      },nextRAF:0,fakeRequestAnimationFrame:function (func) {
        // try to keep 60fps between calls to here
        var now = Date.now();
        if (Browser.nextRAF === 0) {
          Browser.nextRAF = now + 1000/60;
        } else {
          while (now + 2 >= Browser.nextRAF) { // fudge a little, to avoid timer jitter causing us to do lots of delay:0
            Browser.nextRAF += 1000/60;
          }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay);
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          Browser.fakeRequestAnimationFrame(func);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           Browser.fakeRequestAnimationFrame;
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },allowAsyncCallbacks:true,queuedAsyncCallbacks:[],pauseAsyncCallbacks:function () {
        Browser.allowAsyncCallbacks = false;
      },resumeAsyncCallbacks:function () { // marks future callbacks as ok to execute, and synchronously runs any remaining ones right now
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
          var callbacks = Browser.queuedAsyncCallbacks;
          Browser.queuedAsyncCallbacks = [];
          callbacks.forEach(function(func) {
            func();
          });
        }
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        });
      },safeSetTimeout:function (func, timeout) {
        Module['noExitRuntime'] = true;
        return setTimeout(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } else {
            Browser.queuedAsyncCallbacks.push(func);
          }
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        Module['noExitRuntime'] = true;
        return setInterval(function() {
          if (ABORT) return;
          if (Browser.allowAsyncCallbacks) {
            func();
          } // drop it on the floor otherwise, next interval will kick in
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        var delta = 0;
        switch (event.type) {
          case 'DOMMouseScroll': 
            delta = event.detail;
            break;
          case 'mousewheel': 
            delta = event.wheelDelta;
            break;
          case 'wheel': 
            delta = event['deltaY'];
            break;
          default:
            throw 'unrecognized mouse wheel event: ' + event.type;
        }
        return delta;
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
  
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
  
          if (event.type === 'touchstart' || event.type === 'touchend' || event.type === 'touchmove') {
            var touch = event.touch;
            if (touch === undefined) {
              return; // the "touch" property is only defined in SDL
  
            }
            var adjustedX = touch.pageX - (scrollX + rect.left);
            var adjustedY = touch.pageY - (scrollY + rect.top);
  
            adjustedX = adjustedX * (cw / rect.width);
            adjustedY = adjustedY * (ch / rect.height);
  
            var coords = { x: adjustedX, y: adjustedY };
            
            if (event.type === 'touchstart') {
              Browser.lastTouches[touch.identifier] = coords;
              Browser.touches[touch.identifier] = coords;
            } else if (event.type === 'touchend' || event.type === 'touchmove') {
              var last = Browser.touches[touch.identifier];
              if (!last) last = coords;
              Browser.lastTouches[touch.identifier] = last;
              Browser.touches[touch.identifier] = coords;
            } 
            return;
          }
  
          var x = event.pageX - (scrollX + rect.left);
          var y = event.pageY - (scrollY + rect.top);
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency('al ' + url) : '';
        Module['readAsync'](url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (dep) removeRunDependency(dep);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (dep) addRunDependency(dep);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['fullscreenElement'] || document['mozFullScreenElement'] ||
             document['msFullscreenElement'] || document['webkitFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      },wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function () {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle;
      }};function _emscripten_async_wget2(url, file, request, param, arg, onload, onerror, onprogress) {
      Module['noExitRuntime'] = true;
  
      var _url = Pointer_stringify(url);
      var _file = Pointer_stringify(file);
      _file = PATH.resolve(FS.cwd(), _file);
      var _request = Pointer_stringify(request);
      var _param = Pointer_stringify(param);
      var index = _file.lastIndexOf('/');
  
      var http = new XMLHttpRequest();
      http.open(_request, _url, true);
      http.responseType = 'arraybuffer';
  
      var handle = Browser.getNextWgetRequestHandle();
  
      var destinationDirectory = PATH.dirname(_file);
  
      // LOAD
      http.onload = function http_onload(e) {
        if (http.status == 200) {
          // if a file exists there, we overwrite it
          try {
            FS.unlink(_file);
          } catch (e) {}
          // if the destination directory does not yet exist, create it
          FS.mkdirTree(destinationDirectory);
  
          FS.createDataFile( _file.substr(0, index), _file.substr(index + 1), new Uint8Array(http.response), true, true, false);
          if (onload) {
            var stack = Runtime.stackSave();
            Runtime.dynCall('viii', onload, [handle, arg, allocate(intArrayFromString(_file), 'i8', ALLOC_STACK)]);
            Runtime.stackRestore(stack);
          }
        } else {
          if (onerror) Runtime.dynCall('viii', onerror, [handle, arg, http.status]);
        }
  
        delete Browser.wgetRequests[handle];
      };
  
      // ERROR
      http.onerror = function http_onerror(e) {
        if (onerror) Runtime.dynCall('viii', onerror, [handle, arg, http.status]);
        delete Browser.wgetRequests[handle];
      };
  
      // PROGRESS
      http.onprogress = function http_onprogress(e) {
        if (e.lengthComputable || (e.lengthComputable === undefined && e.total != 0)) {
          var percentComplete = (e.loaded / e.total)*100;
          if (onprogress) Runtime.dynCall('viii', onprogress, [handle, arg, percentComplete]);
        }
      };
  
      // ABORT
      http.onabort = function http_onabort(e) {
        delete Browser.wgetRequests[handle];
      };
  
      // Useful because the browser can limit the number of redirection
      try {
        if (http.channel instanceof Ci.nsIHttpChannel)
        http.channel.redirectionLimit = 0;
      } catch (ex) { /* whatever */ }
  
      if (_request == "POST") {
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send(_param);
      } else {
        http.send(null);
      }
  
      Browser.wgetRequests[handle] = http;
  
      return handle;
    }

  function ___lock() {}

  function _glTexParameteri(x0, x1, x2) { GLctx['texParameteri'](x0, x1, x2) }

  function _glFrontFace(x0) { GLctx['frontFace'](x0) }

  function _gettimeofday(ptr) {
      var now = Date.now();
      HEAP32[((ptr)>>2)]=(now/1000)|0; // seconds
      HEAP32[(((ptr)+(4))>>2)]=((now % 1000)*1000)|0; // microseconds
      return 0;
    }

  function _emscripten_set_wheel_callback(target, userData, useCapture, callbackfunc) {
      target = JSEvents.findEventTarget(target);
      if (typeof target.onwheel !== 'undefined') {
        JSEvents.registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "wheel");
        return 0;
      } else if (typeof target.onmousewheel !== 'undefined') {
        JSEvents.registerWheelEventCallback(target, userData, useCapture, callbackfunc, 9, "mousewheel");
        return 0;
      } else {
        return -1;
      }
    }

  function _glScissor(x0, x1, x2, x3) { GLctx['scissor'](x0, x1, x2, x3) }

  
  function emval_get_global() { return (function(){return Function;})()('return this')(); }function __emval_get_global(name) {
      if(name===0){
        return __emval_register(emval_get_global());
      } else {
        name = getStringOrSymbol(name);
        return __emval_register(emval_get_global()[name]);
      }
    }

  function _glGetBooleanv(name_, p) {
      emscriptenWebGLGet(name_, p, 'Boolean');
    }

  function _time(ptr) {
      var ret = (Date.now()/1000)|0;
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }

  function ___syscall140(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // llseek
      var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
      var offset = offset_low;
      assert(offset_high === 0);
      FS.llseek(stream, offset, whence);
      HEAP32[((result)>>2)]=stream.position;
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function __emval_get_property(handle, key) {
      handle = requireHandle(handle);
      key = requireHandle(key);
      return __emval_register(handle[key]);
    }

  function ___syscall221(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // fcntl64
      var stream = SYSCALLS.getStreamFromFD(), cmd = SYSCALLS.get();
      switch (cmd) {
        case 0: {
          var arg = SYSCALLS.get();
          if (arg < 0) {
            return -ERRNO_CODES.EINVAL;
          }
          var newStream;
          newStream = FS.open(stream.path, stream.flags, 0, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = SYSCALLS.get();
          stream.flags |= arg;
          return 0;
        }
        case 12:
        case 12: {
          var arg = SYSCALLS.get();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)]=2;
          return 0;
        }
        case 13:
        case 14:
        case 13:
        case 14:
          return 0; // Pretend that the locking is successful.
        case 16:
        case 8:
          return -ERRNO_CODES.EINVAL; // These are for sockets. We don't have them fully implemented yet.
        case 9:
          // musl trusts getown return values, due to a bug where they must be, as they overlap with errors. just return -1 here, so fnctl() returns that, and we set errno ourselves.
          ___setErrNo(ERRNO_CODES.EINVAL);
          return -1;
        default: {
          return -ERRNO_CODES.EINVAL;
        }
      }
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  var ___dso_handle=STATICTOP; STATICTOP += 16;;
var GLctx; GL.init();
init_emval();;
embind_init_charCodes();
BindingError = Module['BindingError'] = extendError(Error, 'BindingError');;
FS.staticInit();__ATINIT__.unshift(function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() });__ATMAIN__.push(function() { FS.ignorePermissions = false });__ATEXIT__.push(function() { FS.quit() });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;Module["FS_unlink"] = FS.unlink;;
__ATINIT__.unshift(function() { TTY.init() });__ATEXIT__.push(function() { TTY.shutdown() });;
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); var NODEJS_PATH = require("path"); NODEFS.staticInit(); };
InternalError = Module['InternalError'] = extendError(Error, 'InternalError');;
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
      var t = process['hrtime']();
      return t[0] * 1e3 + t[1] / 1e6;
    };
  } else if (typeof dateNow !== 'undefined') {
    _emscripten_get_now = dateNow;
  } else if (typeof self === 'object' && self['performance'] && typeof self['performance']['now'] === 'function') {
    _emscripten_get_now = function() { return self['performance']['now'](); };
  } else if (typeof performance === 'object' && typeof performance['now'] === 'function') {
    _emscripten_get_now = function() { return performance['now'](); };
  } else {
    _emscripten_get_now = Date.now;
  };
___buildEnvironment(ENV);;
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) { Module.printErr("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead."); Module["requestFullScreen"] = Module["requestFullscreen"]; Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice) };
  Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) { Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
  Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) { return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes) };
DYNAMICTOP_PTR = allocate(1, "i32", ALLOC_STATIC);

STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

STACK_MAX = STACK_BASE + TOTAL_STACK;

DYNAMIC_BASE = Runtime.alignMemory(STACK_MAX);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;

staticSealed = true; // seal the static portion of memory



Module['wasmTableSize'] = 467968;

Module['wasmMaxTableSize'] = 467968;

function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    return Module["dynCall_iiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiid(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiiid"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiddi(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiddi"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vif(index,a1,a2) {
  try {
    Module["dynCall_vif"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vid(index,a1,a2) {
  try {
    Module["dynCall_vid"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiii(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vij(index,a1,a2,a3) {
  try {
    Module["dynCall_vij"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  try {
    return Module["dynCall_iiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiidd(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiidd"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vii(index,a1,a2) {
  try {
    Module["dynCall_vii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiid(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    return Module["dynCall_iiiiiiid"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viijii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viijii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ii(index,a1) {
  try {
    return Module["dynCall_ii"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viidddi(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viidddi"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viidiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viidiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viidd(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viidd"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9) {
  try {
    Module["dynCall_viiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viidi(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viidi"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_fff(index,a1,a2) {
  try {
    return Module["dynCall_fff"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iidi(index,a1,a2,a3) {
  try {
    return Module["dynCall_iidi"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiidd(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiidd"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vidii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_vidii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiidid(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiidid"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vidiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_vidiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vidiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_vidiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiddii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiddii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiidiidi(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiidiidi"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12) {
  try {
    Module["dynCall_viiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_diiiii(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_diiiii"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    Module["dynCall_viiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiid(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiid"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiii(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiddiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10) {
  try {
    Module["dynCall_viiiiiddiid"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiddd(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiddd"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viifff(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viifff"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiid(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiid"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vi(index,a1) {
  try {
    Module["dynCall_vi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_vifi(index,a1,a2,a3) {
  try {
    Module["dynCall_vifi"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iij(index,a1,a2,a3) {
  try {
    return Module["dynCall_iij"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_diiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_diiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viid(index,a1,a2,a3) {
  try {
    Module["dynCall_viid"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_di(index,a1) {
  try {
    return Module["dynCall_di"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiidi(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiidi"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiid(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiiid"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_diiiidiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_diiiidiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiidd(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiidd"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiidiiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    return Module["dynCall_iiidiiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iid(index,a1,a2) {
  try {
    return Module["dynCall_iid"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiddd(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiddd"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_dd(index,a1) {
  try {
    return Module["dynCall_dd"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiiii"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_ff(index,a1) {
  try {
    return Module["dynCall_ff"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    return Module["dynCall_iiiiiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_fi(index,a1) {
  try {
    return Module["dynCall_fi"](index,a1);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iii(index,a1,a2) {
  try {
    return Module["dynCall_iii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_diii(index,a1,a2,a3) {
  try {
    return Module["dynCall_diii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viidiidi(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viidiidi"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_dii(index,a1,a2) {
  try {
    return Module["dynCall_dii"](index,a1,a2);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiifiii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiifiii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiddiid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11) {
  try {
    Module["dynCall_viiiiiiddiid"](index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiffii(index,a1,a2,a3,a4,a5,a6,a7) {
  try {
    Module["dynCall_viiiffii"](index,a1,a2,a3,a4,a5,a6,a7);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiddi(index,a1,a2,a3,a4,a5,a6) {
  try {
    Module["dynCall_viiiddi"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiid(index,a1,a2,a3) {
  try {
    return Module["dynCall_iiid"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiii(index,a1,a2,a3,a4) {
  try {
    return Module["dynCall_iiiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiddi(index,a1,a2,a3,a4,a5) {
  try {
    Module["dynCall_viiddi"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6) {
  try {
    return Module["dynCall_iiiiij"](index,a1,a2,a3,a4,a5,a6);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viii(index,a1,a2,a3) {
  try {
    Module["dynCall_viii"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_v(index) {
  try {
    Module["dynCall_v"](index);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    return Module["dynCall_iiiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viif(index,a1,a2,a3) {
  try {
    Module["dynCall_viif"](index,a1,a2,a3);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiiiiiii"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_iiiiid(index,a1,a2,a3,a4,a5) {
  try {
    return Module["dynCall_iiiiid"](index,a1,a2,a3,a4,a5);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiiidddi(index,a1,a2,a3,a4,a5,a6,a7,a8) {
  try {
    Module["dynCall_viiiidddi"](index,a1,a2,a3,a4,a5,a6,a7,a8);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

function invoke_viiii(index,a1,a2,a3,a4) {
  try {
    Module["dynCall_viiii"](index,a1,a2,a3,a4);
  } catch(e) {
    if (typeof e !== 'number' && e !== 'longjmp') throw e;
    asm["setThrew"](1, 0);
  }
}

Module.asmGlobalArg = { "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array, "NaN": NaN, "Infinity": Infinity, "byteLength": byteLength };

Module.asmLibraryArg = { "abort": abort, "assert": assert, "enlargeMemory": enlargeMemory, "getTotalMemory": getTotalMemory, "abortOnCannotGrowMemory": abortOnCannotGrowMemory, "invoke_iiiiiiii": invoke_iiiiiiii, "invoke_iiiiiid": invoke_iiiiiid, "invoke_iiiddi": invoke_iiiddi, "invoke_vif": invoke_vif, "invoke_vid": invoke_vid, "invoke_viiiii": invoke_viiiii, "invoke_vij": invoke_vij, "invoke_iiiiiiiiii": invoke_iiiiiiiiii, "invoke_iiidd": invoke_iiidd, "invoke_vii": invoke_vii, "invoke_iiiiiii": invoke_iiiiiii, "invoke_iiiiiiid": invoke_iiiiiiid, "invoke_viijii": invoke_viijii, "invoke_ii": invoke_ii, "invoke_viidddi": invoke_viidddi, "invoke_viidiii": invoke_viidiii, "invoke_viidd": invoke_viidd, "invoke_viiiiiiiii": invoke_viiiiiiiii, "invoke_viidi": invoke_viidi, "invoke_fff": invoke_fff, "invoke_iidi": invoke_iidi, "invoke_viiidd": invoke_viiidd, "invoke_vidii": invoke_vidii, "invoke_iiiidid": invoke_iiiidid, "invoke_iiiiii": invoke_iiiiii, "invoke_vidiiiii": invoke_vidiiiii, "invoke_vidiiii": invoke_vidiiii, "invoke_viiddii": invoke_viiddii, "invoke_viiidiidi": invoke_viiidiidi, "invoke_viiiiiiiiiiii": invoke_viiiiiiiiiiii, "invoke_diiiii": invoke_diiiii, "invoke_viiiiiiiiiii": invoke_viiiiiiiiiii, "invoke_viiid": invoke_viiid, "invoke_iiii": invoke_iiii, "invoke_viiiiiddiid": invoke_viiiiiddiid, "invoke_viiiiddd": invoke_viiiiddd, "invoke_viifff": invoke_viifff, "invoke_viiiiid": invoke_viiiiid, "invoke_vi": invoke_vi, "invoke_vifi": invoke_vifi, "invoke_iij": invoke_iij, "invoke_diiii": invoke_diiii, "invoke_viid": invoke_viid, "invoke_viiiiiii": invoke_viiiiiii, "invoke_di": invoke_di, "invoke_viiidi": invoke_viiidi, "invoke_viiiid": invoke_viiiid, "invoke_diiiidiii": invoke_diiiidiii, "invoke_viiiidd": invoke_viiiidd, "invoke_iiidiiii": invoke_iiidiiii, "invoke_iid": invoke_iid, "invoke_viiddd": invoke_viiddd, "invoke_dd": invoke_dd, "invoke_viiiiii": invoke_viiiiii, "invoke_ff": invoke_ff, "invoke_iiiiiiiiiiii": invoke_iiiiiiiiiiii, "invoke_fi": invoke_fi, "invoke_iii": invoke_iii, "invoke_diii": invoke_diii, "invoke_viidiidi": invoke_viidiidi, "invoke_dii": invoke_dii, "invoke_viiifiii": invoke_viiifiii, "invoke_viiiiiiddiid": invoke_viiiiiiddiid, "invoke_viiiffii": invoke_viiiffii, "invoke_viiiddi": invoke_viiiddi, "invoke_iiid": invoke_iiid, "invoke_iiiii": invoke_iiiii, "invoke_viiddi": invoke_viiddi, "invoke_iiiiij": invoke_iiiiij, "invoke_viii": invoke_viii, "invoke_v": invoke_v, "invoke_iiiiiiiii": invoke_iiiiiiiii, "invoke_viif": invoke_viif, "invoke_viiiiiiii": invoke_viiiiiiii, "invoke_iiiiid": invoke_iiiiid, "invoke_viiiidddi": invoke_viiiidddi, "invoke_viiii": invoke_viiii, "_glClearStencil": _glClearStencil, "_glUseProgram": _glUseProgram, "_emscripten_set_mouseleave_callback": _emscripten_set_mouseleave_callback, "_strftime_l": _strftime_l, "_pthread_join": _pthread_join, "floatReadValueFromPointer": floatReadValueFromPointer, "simpleReadValueFromPointer": simpleReadValueFromPointer, "__emval_call_void_method": __emval_call_void_method, "_glStencilFunc": _glStencilFunc, "throwInternalError": throwInternalError, "get_first_emval": get_first_emval, "_glUniformMatrix4fv": _glUniformMatrix4fv, "_requestFullScreenCanvas": _requestFullScreenCanvas, "_glLineWidth": _glLineWidth, "_safeSetTimeout": _safeSetTimeout, "_pthread_setspecific": _pthread_setspecific, "__embind_register_void": __embind_register_void, "__emval_register": __emval_register, "___assert_fail": ___assert_fail, "_glDeleteProgram": _glDeleteProgram, "__ZSt18uncaught_exceptionv": __ZSt18uncaught_exceptionv, "extendError": extendError, "_longjmp": _longjmp, "getShiftFromSize": getShiftFromSize, "_glBindBuffer": _glBindBuffer, "_glCullFace": _glCullFace, "_glGetShaderInfoLog": _glGetShaderInfoLog, "__addDays": __addDays, "_signal": _signal, "_llvm_pow_f32": _llvm_pow_f32, "_emscripten_webgl_create_context": _emscripten_webgl_create_context, "_glBlendFunc": _glBlendFunc, "_glGetAttribLocation": _glGetAttribLocation, "_glDisableVertexAttribArray": _glDisableVertexAttribArray, "___cxa_begin_catch": ___cxa_begin_catch, "_emscripten_memcpy_big": _emscripten_memcpy_big, "_emscripten_set_mousedown_callback": _emscripten_set_mousedown_callback, "_sysconf": _sysconf, "__embind_register_std_string": __embind_register_std_string, "__emval_get_global": __emval_get_global, "_clock": _clock, "emscriptenWebGLComputeImageSize": emscriptenWebGLComputeImageSize, "___syscall221": ___syscall221, "_glUniform4f": _glUniform4f, "getStringOrSymbol": getStringOrSymbol, "_refreshWebGLCanvas": _refreshWebGLCanvas, "___syscall77": ___syscall77, "___syscall63": ___syscall63, "_glewGetErrorString": _glewGetErrorString, "_glFramebufferTexture2D": _glFramebufferTexture2D, "___cxa_pure_virtual": ___cxa_pure_virtual, "whenDependentTypesAreResolved": whenDependentTypesAreResolved, "_emscripten_webgl_make_context_current": _emscripten_webgl_make_context_current, "_glGenBuffers": _glGenBuffers, "_glShaderSource": _glShaderSource, "_glFramebufferRenderbuffer": _glFramebufferRenderbuffer, "___syscall330": ___syscall330, "___cxa_atexit": ___cxa_atexit, "__emval_allocateDestructors": __emval_allocateDestructors, "_pthread_cleanup_push": _pthread_cleanup_push, "_glGetBooleanv": _glGetBooleanv, "getTypeName": getTypeName, "___syscall140": ___syscall140, "__emval_new": __emval_new, "___syscall145": ___syscall145, "___syscall146": ___syscall146, "_pthread_cleanup_pop": _pthread_cleanup_pop, "_glGenerateMipmap": _glGenerateMipmap, "_glVertexAttribPointer": _glVertexAttribPointer, "_canXhrOnUrl": _canXhrOnUrl, "craftEmvalAllocator": craftEmvalAllocator, "_glGetProgramInfoLog": _glGetProgramInfoLog, "throwBindingError": throwBindingError, "__emval_incref": __emval_incref, "__arraySum": __arraySum, "_setProgressBarValueWorker": _setProgressBarValueWorker, "___cxa_find_matching_catch": ___cxa_find_matching_catch, "_glBindRenderbuffer": _glBindRenderbuffer, "_glDrawElements": _glDrawElements, "__embind_register_emval": __embind_register_emval, "_glBufferSubData": _glBufferSubData, "_glViewport": _glViewport, "___setErrNo": ___setErrNo, "readLatin1String": readLatin1String, "_glDeleteTextures": _glDeleteTextures, "_glDepthFunc": _glDepthFunc, "_glStencilOpSeparate": _glStencilOpSeparate, "__embind_register_bool": __embind_register_bool, "___resumeException": ___resumeException, "_focusCanvas": _focusCanvas, "createNamedFunction": createNamedFunction, "embind_init_charCodes": embind_init_charCodes, "_emscripten_set_mouseenter_callback": _emscripten_set_mouseenter_callback, "__emval_decref": __emval_decref, "_pthread_once": _pthread_once, "_glGenTextures": _glGenTextures, "_glGetIntegerv": _glGetIntegerv, "_glGetString": _glGetString, "_localtime": _localtime, "__emval_addMethodCaller": __emval_addMethodCaller, "__emval_get_property": __emval_get_property, "__emval_lookupTypes": __emval_lookupTypes, "_emscripten_set_mouseup_callback": _emscripten_set_mouseup_callback, "_emscripten_get_now": _emscripten_get_now, "__emval_call_method": __emval_call_method, "_glAttachShader": _glAttachShader, "_glCreateProgram": _glCreateProgram, "_glVertexAttribDivisorARB": _glVertexAttribDivisorARB, "___syscall3": ___syscall3, "___lock": ___lock, "emscriptenWebGLGetTexPixelData": emscriptenWebGLGetTexPixelData, "___syscall6": ___syscall6, "___syscall5": ___syscall5, "___syscall4": ___syscall4, "_isChrome": _isChrome, "_glDepthRange": _glDepthRange, "_glBindFramebuffer": _glBindFramebuffer, "_glDetachShader": _glDetachShader, "_gettimeofday": _gettimeofday, "new_": new_, "_glGenFramebuffers": _glGenFramebuffers, "_glUniform2f": _glUniform2f, "_emscripten_run_script": _emscripten_run_script, "_glUniform1fv": _glUniform1fv, "_llvm_pow_f64": _llvm_pow_f64, "_emscripten_set_keypress_callback": _emscripten_set_keypress_callback, "_glDeleteFramebuffers": _glDeleteFramebuffers, "___syscall54": ___syscall54, "_emscripten_async_wget2": _emscripten_async_wget2, "_glCheckFramebufferStatus": _glCheckFramebufferStatus, "_emscripten_set_main_loop_timing": _emscripten_set_main_loop_timing, "emscriptenWebGLGet": emscriptenWebGLGet, "__embind_register_integer": __embind_register_integer, "___cxa_allocate_exception": ___cxa_allocate_exception, "_glGetBufferParameteriv": _glGetBufferParameteriv, "___buildEnvironment": ___buildEnvironment, "__isLeapYear": __isLeapYear, "_glUniform3fv": _glUniform3fv, "_localtime_r": _localtime_r, "_tzset": _tzset, "_glClearColor": _glClearColor, "_glFinish": _glFinish, "_glUniform1f": _glUniform1f, "___syscall195": ___syscall195, "___syscall10": ___syscall10, "_glUniform1i": _glUniform1i, "_embind_repr": _embind_repr, "_strftime": _strftime, "_glDrawArrays": _glDrawArrays, "_glReadPixels": _glReadPixels, "_glCreateShader": _glCreateShader, "__emval_run_destructors": __emval_run_destructors, "_loadImageFromUrl": _loadImageFromUrl, "_pthread_mutex_destroy": _pthread_mutex_destroy, "_emscripten_webgl_init_context_attributes": _emscripten_webgl_init_context_attributes, "runDestructors": runDestructors, "requireRegisteredType": requireRegisteredType, "makeLegalFunctionName": makeLegalFunctionName, "_pthread_key_create": _pthread_key_create, "__emval_set_property": __emval_set_property, "_glActiveTexture": _glActiveTexture, "init_emval": init_emval, "___syscall39": ___syscall39, "_emscripten_longjmp": _emscripten_longjmp, "_glFrontFace": _glFrontFace, "_glCompileShader": _glCompileShader, "_glEnableVertexAttribArray": _glEnableVertexAttribArray, "registerType": registerType, "_abort": _abort, "requireHandle": requireHandle, "___syscall183": ___syscall183, "_setProgressBarCommentWorker": _setProgressBarCommentWorker, "_workerMode": _workerMode, "_glDeleteBuffers": _glDeleteBuffers, "_glBufferData": _glBufferData, "_glTexImage2D": _glTexImage2D, "_glewInit": _glewInit, "__emval_take_value": __emval_take_value, "__emval_get_method_caller": __emval_get_method_caller, "_pthread_getspecific": _pthread_getspecific, "_pthread_cond_wait": _pthread_cond_wait, "_glDeleteShader": _glDeleteShader, "_glGetProgramiv": _glGetProgramiv, "__embind_register_memory_view": __embind_register_memory_view, "_glScissor": _glScissor, "___syscall40": ___syscall40, "_glStencilOp": _glStencilOp, "___gxx_personality_v0": ___gxx_personality_v0, "_emscripten_set_mousemove_callback": _emscripten_set_mousemove_callback, "_glDeleteRenderbuffers": _glDeleteRenderbuffers, "__emval_new_array": __emval_new_array, "_domElementExists": _domElementExists, "_glDisable": _glDisable, "_glLinkProgram": _glLinkProgram, "_time": _time, "_times": _times, "_glGetError": _glGetError, "_resizeWebGLCanvas": _resizeWebGLCanvas, "_glGenRenderbuffers": _glGenRenderbuffers, "_blurCanvas": _blurCanvas, "_glGetUniformLocation": _glGetUniformLocation, "_glClear": _glClear, "_glUniform4fv": _glUniform4fv, "_glRenderbufferStorage": _glRenderbufferStorage, "_glBindTexture": _glBindTexture, "__exit": __exit, "_glBindAttribLocation": _glBindAttribLocation, "_glPixelStorei": _glPixelStorei, "_glGetShaderiv": _glGetShaderiv, "_glCopyTexImage2D": _glCopyTexImage2D, "_emscripten_webgl_destroy_context": _emscripten_webgl_destroy_context, "_glEnable": _glEnable, "__embind_register_float": __embind_register_float, "_emscripten_set_wheel_callback": _emscripten_set_wheel_callback, "integerReadValueFromPointer": integerReadValueFromPointer, "___unlock": ___unlock, "__embind_register_std_wstring": __embind_register_std_wstring, "_pthread_create": _pthread_create, "_emscripten_set_main_loop": _emscripten_set_main_loop, "_exit": _exit, "_glDepthMask": _glDepthMask, "emval_get_global": emval_get_global, "_getenv": _getenv, "___cxa_throw": ___cxa_throw, "_glColorMask": _glColorMask, "__emval_new_cstring": __emval_new_cstring, "count_emval_handles": count_emval_handles, "_glTexParameteri": _glTexParameteri, "_glDrawElementsInstancedARB": _glDrawElementsInstancedARB, "_atexit": _atexit, "_glStencilMask": _glStencilMask, "_pthread_mutex_init": _pthread_mutex_init, "_glTexSubImage2D": _glTexSubImage2D, "DYNAMICTOP_PTR": DYNAMICTOP_PTR, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "___dso_handle": ___dso_handle };
// EMSCRIPTEN_START_ASM
var asm =Module["asm"]// EMSCRIPTEN_END_ASM
(Module.asmGlobalArg, Module.asmLibraryArg, buffer);

var _Graph_delEdges = Module["_Graph_delEdges"] = asm["_Graph_delEdges"];
var __GLOBAL__sub_I_RectangleZoomInteractor_cpp = Module["__GLOBAL__sub_I_RectangleZoomInteractor_cpp"] = asm["__GLOBAL__sub_I_RectangleZoomInteractor_cpp"];
var __GLOBAL__sub_I_TlpJsonExport_cpp = Module["__GLOBAL__sub_I_TlpJsonExport_cpp"] = asm["__GLOBAL__sub_I_TlpJsonExport_cpp"];
var _Graph_getDescendantGraph2 = Module["_Graph_getDescendantGraph2"] = asm["_Graph_getDescendantGraph2"];
var _Graph_getDescendantGraph1 = Module["_Graph_getDescendantGraph1"] = asm["_Graph_getDescendantGraph1"];
var _Graph_getLocalDoubleVectorProperty = Module["_Graph_getLocalDoubleVectorProperty"] = asm["_Graph_getLocalDoubleVectorProperty"];
var _getViewRenderingParameters = Module["_getViewRenderingParameters"] = asm["_getViewRenderingParameters"];
var _Graph_hasEdge = Module["_Graph_hasEdge"] = asm["_Graph_hasEdge"];
var _GlGraphRenderingParameters_setDisplayEdgesExtremities = Module["_GlGraphRenderingParameters_setDisplayEdgesExtremities"] = asm["_GlGraphRenderingParameters_setDisplayEdgesExtremities"];
var _LayoutProperty_rotateZ = Module["_LayoutProperty_rotateZ"] = asm["_LayoutProperty_rotateZ"];
var _PropertyInterface_getEdgeStringValue = Module["_PropertyInterface_getEdgeStringValue"] = asm["_PropertyInterface_getEdgeStringValue"];
var _LayoutProperty_rotateX = Module["_LayoutProperty_rotateX"] = asm["_LayoutProperty_rotateX"];
var __GLOBAL__sub_I_TLPBExport_cpp = Module["__GLOBAL__sub_I_TLPBExport_cpp"] = asm["__GLOBAL__sub_I_TLPBExport_cpp"];
var _Graph_applyAlgorithm = Module["_Graph_applyAlgorithm"] = asm["_Graph_applyAlgorithm"];
var _propertyAlgorithmExists = Module["_propertyAlgorithmExists"] = asm["_propertyAlgorithmExists"];
var __GLOBAL__sub_I_OGDFDominance_cpp = Module["__GLOBAL__sub_I_OGDFDominance_cpp"] = asm["__GLOBAL__sub_I_OGDFDominance_cpp"];
var _StringProperty_setAllEdgeValue = Module["_StringProperty_setAllEdgeValue"] = asm["_StringProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_ImportPajek_cpp = Module["__GLOBAL__sub_I_ImportPajek_cpp"] = asm["__GLOBAL__sub_I_ImportPajek_cpp"];
var _Graph_deg = Module["_Graph_deg"] = asm["_Graph_deg"];
var __GLOBAL__sub_I_SmallWorldGraph_cpp = Module["__GLOBAL__sub_I_SmallWorldGraph_cpp"] = asm["__GLOBAL__sub_I_SmallWorldGraph_cpp"];
var __GLOBAL__sub_I_ConnectedComponentPacking_cpp = Module["__GLOBAL__sub_I_ConnectedComponentPacking_cpp"] = asm["__GLOBAL__sub_I_ConnectedComponentPacking_cpp"];
var _getIntegerAlgorithmPluginsList = Module["_getIntegerAlgorithmPluginsList"] = asm["_getIntegerAlgorithmPluginsList"];
var _ColorVectorProperty_getEdgeValue = Module["_ColorVectorProperty_getEdgeValue"] = asm["_ColorVectorProperty_getEdgeValue"];
var __GLOBAL__sub_I_QuotientClustering_cpp = Module["__GLOBAL__sub_I_QuotientClustering_cpp"] = asm["__GLOBAL__sub_I_QuotientClustering_cpp"];
var __GLOBAL__sub_I_OGDFCircular_cpp = Module["__GLOBAL__sub_I_OGDFCircular_cpp"] = asm["__GLOBAL__sub_I_OGDFCircular_cpp"];
var _IntegerVectorProperty_setAllNodeValue = Module["_IntegerVectorProperty_setAllNodeValue"] = asm["_IntegerVectorProperty_setAllNodeValue"];
var _setCanvasGraph = Module["_setCanvasGraph"] = asm["_setCanvasGraph"];
var __GLOBAL__sub_I_CrossGlyph_cpp = Module["__GLOBAL__sub_I_CrossGlyph_cpp"] = asm["__GLOBAL__sub_I_CrossGlyph_cpp"];
var __GLOBAL__sub_I_CompleteGraph_cpp = Module["__GLOBAL__sub_I_CompleteGraph_cpp"] = asm["__GLOBAL__sub_I_CompleteGraph_cpp"];
var _IntegerVectorProperty_setAllEdgeValue = Module["_IntegerVectorProperty_setAllEdgeValue"] = asm["_IntegerVectorProperty_setAllEdgeValue"];
var _Graph_isMetaNode = Module["_Graph_isMetaNode"] = asm["_Graph_isMetaNode"];
var _Graph_getDescendantGraphs = Module["_Graph_getDescendantGraphs"] = asm["_Graph_getDescendantGraphs"];
var _GlGraphRenderingParameters_setDisplayNodes = Module["_GlGraphRenderingParameters_setDisplayNodes"] = asm["_GlGraphRenderingParameters_setDisplayNodes"];
var _getViewInputData = Module["_getViewInputData"] = asm["_getViewInputData"];
var _BooleanVectorProperty_getNodeValue = Module["_BooleanVectorProperty_getNodeValue"] = asm["_BooleanVectorProperty_getNodeValue"];
var __GLOBAL__sub_I_TulipBindings_cpp = Module["__GLOBAL__sub_I_TulipBindings_cpp"] = asm["__GLOBAL__sub_I_TulipBindings_cpp"];
var __GLOBAL__sub_I_NodeMetric_cpp = Module["__GLOBAL__sub_I_NodeMetric_cpp"] = asm["__GLOBAL__sub_I_NodeMetric_cpp"];
var _GlGraphInputData_getElementFontSize = Module["_GlGraphInputData_getElementFontSize"] = asm["_GlGraphInputData_getElementFontSize"];
var __GLOBAL__sub_I_BooleanProperty_cpp = Module["__GLOBAL__sub_I_BooleanProperty_cpp"] = asm["__GLOBAL__sub_I_BooleanProperty_cpp"];
var _ColorVectorProperty_getNodeVectorSize = Module["_ColorVectorProperty_getNodeVectorSize"] = asm["_ColorVectorProperty_getNodeVectorSize"];
var _BooleanVectorProperty_getEdgeVectorSize = Module["_BooleanVectorProperty_getEdgeVectorSize"] = asm["_BooleanVectorProperty_getEdgeVectorSize"];
var _Graph_getEdges2 = Module["_Graph_getEdges2"] = asm["_Graph_getEdges2"];
var _Graph_delNode = Module["_Graph_delNode"] = asm["_Graph_delNode"];
var ___cxx_global_var_init_326 = Module["___cxx_global_var_init_326"] = asm["___cxx_global_var_init_326"];
var _DoubleVectorProperty_getNodeDefaultVectorSize = Module["_DoubleVectorProperty_getNodeDefaultVectorSize"] = asm["_DoubleVectorProperty_getNodeDefaultVectorSize"];
var _ColorScale_getColorAtPos = Module["_ColorScale_getColorAtPos"] = asm["_ColorScale_getColorAtPos"];
var _Graph_getLocalCoordVectorProperty = Module["_Graph_getLocalCoordVectorProperty"] = asm["_Graph_getLocalCoordVectorProperty"];
var _Graph_numberOfSubGraphs = Module["_Graph_numberOfSubGraphs"] = asm["_Graph_numberOfSubGraphs"];
var __GLOBAL__sub_I_ReverseEdges_cpp = Module["__GLOBAL__sub_I_ReverseEdges_cpp"] = asm["__GLOBAL__sub_I_ReverseEdges_cpp"];
var __GLOBAL__sub_I_GlGraphStaticData_cpp = Module["__GLOBAL__sub_I_GlGraphStaticData_cpp"] = asm["__GLOBAL__sub_I_GlGraphStaticData_cpp"];
var __GLOBAL__sub_I_EmptyGraph_cpp = Module["__GLOBAL__sub_I_EmptyGraph_cpp"] = asm["__GLOBAL__sub_I_EmptyGraph_cpp"];
var __GLOBAL__sub_I_TlpTools_cpp = Module["__GLOBAL__sub_I_TlpTools_cpp"] = asm["__GLOBAL__sub_I_TlpTools_cpp"];
var __GLOBAL__sub_I_GraphTools_cpp = Module["__GLOBAL__sub_I_GraphTools_cpp"] = asm["__GLOBAL__sub_I_GraphTools_cpp"];
var _numberOfBooleanAlgorithms = Module["_numberOfBooleanAlgorithms"] = asm["_numberOfBooleanAlgorithms"];
var __GLOBAL__sub_I_ConcaveHullBuilder_cpp = Module["__GLOBAL__sub_I_ConcaveHullBuilder_cpp"] = asm["__GLOBAL__sub_I_ConcaveHullBuilder_cpp"];
var __GLOBAL__sub_I_ConeTreeExtended_cpp = Module["__GLOBAL__sub_I_ConeTreeExtended_cpp"] = asm["__GLOBAL__sub_I_ConeTreeExtended_cpp"];
var __GLOBAL__sub_I_MetricMapping_cpp = Module["__GLOBAL__sub_I_MetricMapping_cpp"] = asm["__GLOBAL__sub_I_MetricMapping_cpp"];
var __GLOBAL__sub_I_CglLandPValidator_cpp = Module["__GLOBAL__sub_I_CglLandPValidator_cpp"] = asm["__GLOBAL__sub_I_CglLandPValidator_cpp"];
var _LayoutProperty_normalize = Module["_LayoutProperty_normalize"] = asm["_LayoutProperty_normalize"];
var _LayoutProperty_setNodeValue = Module["_LayoutProperty_setNodeValue"] = asm["_LayoutProperty_setNodeValue"];
var _numberOfIntegerAlgorithms = Module["_numberOfIntegerAlgorithms"] = asm["_numberOfIntegerAlgorithms"];
var _Camera_setProjectionMatrix = Module["_Camera_setProjectionMatrix"] = asm["_Camera_setProjectionMatrix"];
var _getStringAlgorithmPluginsList = Module["_getStringAlgorithmPluginsList"] = asm["_getStringAlgorithmPluginsList"];
var _GlGraphInputData_setElementGlow = Module["_GlGraphInputData_setElementGlow"] = asm["_GlGraphInputData_setElementGlow"];
var _StringVectorProperty_setEdgeValue = Module["_StringVectorProperty_setEdgeValue"] = asm["_StringVectorProperty_setEdgeValue"];
var __GLOBAL__sub_I_Eccentricity_cpp = Module["__GLOBAL__sub_I_Eccentricity_cpp"] = asm["__GLOBAL__sub_I_Eccentricity_cpp"];
var ___cxx_global_var_init_35 = Module["___cxx_global_var_init_35"] = asm["___cxx_global_var_init_35"];
var _Graph_getLocalIntegerProperty = Module["_Graph_getLocalIntegerProperty"] = asm["_Graph_getLocalIntegerProperty"];
var _createIntegerVectorProperty = Module["_createIntegerVectorProperty"] = asm["_createIntegerVectorProperty"];
var __GLOBAL__sub_I_OGDFTileToRowsPacking_cpp = Module["__GLOBAL__sub_I_OGDFTileToRowsPacking_cpp"] = asm["__GLOBAL__sub_I_OGDFTileToRowsPacking_cpp"];
var _GlGraphRenderingParameters_displayNodesLabels = Module["_GlGraphRenderingParameters_displayNodesLabels"] = asm["_GlGraphRenderingParameters_displayNodesLabels"];
var _LayoutProperty_getEdgeDefaultValue = Module["_LayoutProperty_getEdgeDefaultValue"] = asm["_LayoutProperty_getEdgeDefaultValue"];
var _GlGraphInputData_setElementGlowColor = Module["_GlGraphInputData_setElementGlowColor"] = asm["_GlGraphInputData_setElementGlowColor"];
var _Graph_getNthSubGraph = Module["_Graph_getNthSubGraph"] = asm["_Graph_getNthSubGraph"];
var __GLOBAL__sub_I_GMLExport_cpp = Module["__GLOBAL__sub_I_GMLExport_cpp"] = asm["__GLOBAL__sub_I_GMLExport_cpp"];
var _setViewBackupBackBuffer = Module["_setViewBackupBackBuffer"] = asm["_setViewBackupBackBuffer"];
var _Graph_inducedSubGraph = Module["_Graph_inducedSubGraph"] = asm["_Graph_inducedSubGraph"];
var __GLOBAL__sub_I_Tutte_cpp = Module["__GLOBAL__sub_I_Tutte_cpp"] = asm["__GLOBAL__sub_I_Tutte_cpp"];
var __GLOBAL__sub_I_GlBuffer_cpp = Module["__GLOBAL__sub_I_GlBuffer_cpp"] = asm["__GLOBAL__sub_I_GlBuffer_cpp"];
var _Graph_addEdge1 = Module["_Graph_addEdge1"] = asm["_Graph_addEdge1"];
var _Graph_getAttributesJSON = Module["_Graph_getAttributesJSON"] = asm["_Graph_getAttributesJSON"];
var _Graph_addEdge2 = Module["_Graph_addEdge2"] = asm["_Graph_addEdge2"];
var __GLOBAL__sub_I_GlCPULODCalculator_cpp = Module["__GLOBAL__sub_I_GlCPULODCalculator_cpp"] = asm["__GLOBAL__sub_I_GlCPULODCalculator_cpp"];
var __GLOBAL__sub_I_ImportUCINET_cpp = Module["__GLOBAL__sub_I_ImportUCINET_cpp"] = asm["__GLOBAL__sub_I_ImportUCINET_cpp"];
var _pluginsNamesLengths = Module["_pluginsNamesLengths"] = asm["_pluginsNamesLengths"];
var _Graph_isDescendantGraph = Module["_Graph_isDescendantGraph"] = asm["_Graph_isDescendantGraph"];
var _BooleanVectorProperty_getNodeDefaultValue = Module["_BooleanVectorProperty_getNodeDefaultValue"] = asm["_BooleanVectorProperty_getNodeDefaultValue"];
var __GLOBAL__sub_I_NanoVGManager_cpp = Module["__GLOBAL__sub_I_NanoVGManager_cpp"] = asm["__GLOBAL__sub_I_NanoVGManager_cpp"];
var _GlGraphInputData_getElementLabel = Module["_GlGraphInputData_getElementLabel"] = asm["_GlGraphInputData_getElementLabel"];
var _numberOfAlgorithms = Module["_numberOfAlgorithms"] = asm["_numberOfAlgorithms"];
var _getDefaultAlgorithmParametersJSON = Module["_getDefaultAlgorithmParametersJSON"] = asm["_getDefaultAlgorithmParametersJSON"];
var _ColorVectorProperty_getEdgeVectorSize = Module["_ColorVectorProperty_getEdgeVectorSize"] = asm["_ColorVectorProperty_getEdgeVectorSize"];
var __GLOBAL__sub_I_ClusterMetric_cpp = Module["__GLOBAL__sub_I_ClusterMetric_cpp"] = asm["__GLOBAL__sub_I_ClusterMetric_cpp"];
var _Graph_getIntegerProperty = Module["_Graph_getIntegerProperty"] = asm["_Graph_getIntegerProperty"];
var _GlGraphInputData_setElementTgtAnchorShape = Module["_GlGraphInputData_setElementTgtAnchorShape"] = asm["_GlGraphInputData_setElementTgtAnchorShape"];
var _IntegerProperty_setEdgeValue = Module["_IntegerProperty_setEdgeValue"] = asm["_IntegerProperty_setEdgeValue"];
var __GLOBAL__sub_I_Acyclic_cpp = Module["__GLOBAL__sub_I_Acyclic_cpp"] = asm["__GLOBAL__sub_I_Acyclic_cpp"];
var _IntegerVectorProperty_getEdgeDefaultValue = Module["_IntegerVectorProperty_getEdgeDefaultValue"] = asm["_IntegerVectorProperty_getEdgeDefaultValue"];
var _LayoutProperty_scale = Module["_LayoutProperty_scale"] = asm["_LayoutProperty_scale"];
var __GLOBAL__sub_I_TriangleGlyph_cpp = Module["__GLOBAL__sub_I_TriangleGlyph_cpp"] = asm["__GLOBAL__sub_I_TriangleGlyph_cpp"];
var __GLOBAL__sub_I_OGDFSugiyama_cpp = Module["__GLOBAL__sub_I_OGDFSugiyama_cpp"] = asm["__GLOBAL__sub_I_OGDFSugiyama_cpp"];
var __GLOBAL__sub_I_OGDFTree_cpp = Module["__GLOBAL__sub_I_OGDFTree_cpp"] = asm["__GLOBAL__sub_I_OGDFTree_cpp"];
var _pthread_mutex_trylock = Module["_pthread_mutex_trylock"] = asm["_pthread_mutex_trylock"];
var _layoutAlgorithmsNamesLengths = Module["_layoutAlgorithmsNamesLengths"] = asm["_layoutAlgorithmsNamesLengths"];
var _DoubleProperty_setAllNodeValue = Module["_DoubleProperty_setAllNodeValue"] = asm["_DoubleProperty_setAllNodeValue"];
var __GLOBAL__sub_I_Random_cpp = Module["__GLOBAL__sub_I_Random_cpp"] = asm["__GLOBAL__sub_I_Random_cpp"];
var ___cxx_global_var_init_1_327 = Module["___cxx_global_var_init_1_327"] = asm["___cxx_global_var_init_1_327"];
var __GLOBAL__sub_I_OGDFPlanarizationLayout_cpp = Module["__GLOBAL__sub_I_OGDFPlanarizationLayout_cpp"] = asm["__GLOBAL__sub_I_OGDFPlanarizationLayout_cpp"];
var _GlGraphRenderingParameters_setBillboardedNodes = Module["_GlGraphRenderingParameters_setBillboardedNodes"] = asm["_GlGraphRenderingParameters_setBillboardedNodes"];
var _StringVectorProperty_getNodeVectorSize = Module["_StringVectorProperty_getNodeVectorSize"] = asm["_StringVectorProperty_getNodeVectorSize"];
var _Graph_getName = Module["_Graph_getName"] = asm["_Graph_getName"];
var _createStringProperty = Module["_createStringProperty"] = asm["_createStringProperty"];
var _StringProperty_setNodeValue = Module["_StringProperty_setNodeValue"] = asm["_StringProperty_setNodeValue"];
var _numberOfDoubleAlgorithms = Module["_numberOfDoubleAlgorithms"] = asm["_numberOfDoubleAlgorithms"];
var _Graph_getLocalLayoutProperty = Module["_Graph_getLocalLayoutProperty"] = asm["_Graph_getLocalLayoutProperty"];
var __GLOBAL__sub_I_OGDFFastMultipoleMultilevelEmbedder_cpp = Module["__GLOBAL__sub_I_OGDFFastMultipoleMultilevelEmbedder_cpp"] = asm["__GLOBAL__sub_I_OGDFFastMultipoleMultilevelEmbedder_cpp"];
var _BooleanVectorProperty_setAllNodeValue = Module["_BooleanVectorProperty_setAllNodeValue"] = asm["_BooleanVectorProperty_setAllNodeValue"];
var _setPluginProgressGraphId = Module["_setPluginProgressGraphId"] = asm["_setPluginProgressGraphId"];
var __GLOBAL__sub_I_OrientableCoord_cpp = Module["__GLOBAL__sub_I_OrientableCoord_cpp"] = asm["__GLOBAL__sub_I_OrientableCoord_cpp"];
var __GLOBAL__sub_I_OGDFFm3_cpp = Module["__GLOBAL__sub_I_OGDFFm3_cpp"] = asm["__GLOBAL__sub_I_OGDFFm3_cpp"];
var _Graph_getEdges = Module["_Graph_getEdges"] = asm["_Graph_getEdges"];
var __GLOBAL__sub_I_StrongComponent_cpp = Module["__GLOBAL__sub_I_StrongComponent_cpp"] = asm["__GLOBAL__sub_I_StrongComponent_cpp"];
var _IntegerProperty_getNodeValue = Module["_IntegerProperty_getNodeValue"] = asm["_IntegerProperty_getNodeValue"];
var _LayoutProperty_setEdgeValue = Module["_LayoutProperty_setEdgeValue"] = asm["_LayoutProperty_setEdgeValue"];
var __GLOBAL__sub_I_MixedModel_cpp = Module["__GLOBAL__sub_I_MixedModel_cpp"] = asm["__GLOBAL__sub_I_MixedModel_cpp"];
var _Graph_getInNodes = Module["_Graph_getInNodes"] = asm["_Graph_getInNodes"];
var _GlGraphInputData_getElementTgtAnchorSize = Module["_GlGraphInputData_getElementTgtAnchorSize"] = asm["_GlGraphInputData_getElementTgtAnchorSize"];
var _Graph_getStringProperty = Module["_Graph_getStringProperty"] = asm["_Graph_getStringProperty"];
var _Graph_source = Module["_Graph_source"] = asm["_Graph_source"];
var _malloc = Module["_malloc"] = asm["_malloc"];
var _emscripten_replace_memory = Module["_emscripten_replace_memory"] = asm["_emscripten_replace_memory"];
var __GLOBAL__sub_I_DataSet_cpp = Module["__GLOBAL__sub_I_DataSet_cpp"] = asm["__GLOBAL__sub_I_DataSet_cpp"];
var _SizeProperty_getMax = Module["_SizeProperty_getMax"] = asm["_SizeProperty_getMax"];
var __GLOBAL__sub_I_Biconnected_cpp = Module["__GLOBAL__sub_I_Biconnected_cpp"] = asm["__GLOBAL__sub_I_Biconnected_cpp"];
var _Graph_getLocalSizeProperty = Module["_Graph_getLocalSizeProperty"] = asm["_Graph_getLocalSizeProperty"];
var _GlGraphInputData_getElementTexture = Module["_GlGraphInputData_getElementTexture"] = asm["_GlGraphInputData_getElementTexture"];
var _addSubGraphsHulls = Module["_addSubGraphsHulls"] = asm["_addSubGraphsHulls"];
var _Graph_numberOfProperties = Module["_Graph_numberOfProperties"] = asm["_Graph_numberOfProperties"];
var _loadGraph = Module["_loadGraph"] = asm["_loadGraph"];
var _Graph_opposite = Module["_Graph_opposite"] = asm["_Graph_opposite"];
var _activateInteractor = Module["_activateInteractor"] = asm["_activateInteractor"];
var __GLOBAL__sub_I_bind_cpp = Module["__GLOBAL__sub_I_bind_cpp"] = asm["__GLOBAL__sub_I_bind_cpp"];
var _BooleanVectorProperty_getEdgeDefaultValue = Module["_BooleanVectorProperty_getEdgeDefaultValue"] = asm["_BooleanVectorProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_LinLogLayout_cpp = Module["__GLOBAL__sub_I_LinLogLayout_cpp"] = asm["__GLOBAL__sub_I_LinLogLayout_cpp"];
var _updateGlScene = Module["_updateGlScene"] = asm["_updateGlScene"];
var _StringVectorProperty_getNodeDefaultVectorSize = Module["_StringVectorProperty_getNodeDefaultVectorSize"] = asm["_StringVectorProperty_getNodeDefaultVectorSize"];
var _ColorScale_numberOfColors = Module["_ColorScale_numberOfColors"] = asm["_ColorScale_numberOfColors"];
var ___cxx_global_var_init_7_330 = Module["___cxx_global_var_init_7_330"] = asm["___cxx_global_var_init_7_330"];
var _SizeProperty_setAllEdgeValue = Module["_SizeProperty_setAllEdgeValue"] = asm["_SizeProperty_setAllEdgeValue"];
var _IntegerProperty_getEdgeDefaultValue = Module["_IntegerProperty_getEdgeDefaultValue"] = asm["_IntegerProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_QuadTree_cpp = Module["__GLOBAL__sub_I_QuadTree_cpp"] = asm["__GLOBAL__sub_I_QuadTree_cpp"];
var _GlGraphInputData_getElementSrcAnchorSize = Module["_GlGraphInputData_getElementSrcAnchorSize"] = asm["_GlGraphInputData_getElementSrcAnchorSize"];
var _numberOfImportPlugins = Module["_numberOfImportPlugins"] = asm["_numberOfImportPlugins"];
var __GLOBAL__sub_I_TulipMaterialDesignIcons_cpp = Module["__GLOBAL__sub_I_TulipMaterialDesignIcons_cpp"] = asm["__GLOBAL__sub_I_TulipMaterialDesignIcons_cpp"];
var __GLOBAL__sub_I_GlyphsRenderer_cpp = Module["__GLOBAL__sub_I_GlyphsRenderer_cpp"] = asm["__GLOBAL__sub_I_GlyphsRenderer_cpp"];
var _createLayoutProperty = Module["_createLayoutProperty"] = asm["_createLayoutProperty"];
var __GLOBAL__sub_I_InducedSubGraphSelection_cpp = Module["__GLOBAL__sub_I_InducedSubGraphSelection_cpp"] = asm["__GLOBAL__sub_I_InducedSubGraphSelection_cpp"];
var _DoubleVectorProperty_setAllEdgeValue = Module["_DoubleVectorProperty_setAllEdgeValue"] = asm["_DoubleVectorProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_Connected_cpp = Module["__GLOBAL__sub_I_Connected_cpp"] = asm["__GLOBAL__sub_I_Connected_cpp"];
var _SizeProperty_getNodeValue = Module["_SizeProperty_getNodeValue"] = asm["_SizeProperty_getNodeValue"];
var __GLOBAL__sub_I_OctTree_cpp = Module["__GLOBAL__sub_I_OctTree_cpp"] = asm["__GLOBAL__sub_I_OctTree_cpp"];
var _StringVectorProperty_setAllNodeValue = Module["_StringVectorProperty_setAllNodeValue"] = asm["_StringVectorProperty_setAllNodeValue"];
var _desactivateInteractor = Module["_desactivateInteractor"] = asm["_desactivateInteractor"];
var __GLOBAL__sub_I_CircleGlyph_cpp = Module["__GLOBAL__sub_I_CircleGlyph_cpp"] = asm["__GLOBAL__sub_I_CircleGlyph_cpp"];
var __GLOBAL__sub_I_GlEntity_cpp = Module["__GLOBAL__sub_I_GlEntity_cpp"] = asm["__GLOBAL__sub_I_GlEntity_cpp"];
var _saveGraph = Module["_saveGraph"] = asm["_saveGraph"];
var _pthread_self = Module["_pthread_self"] = asm["_pthread_self"];
var __GLOBAL__sub_I_Random_cpp_4065 = Module["__GLOBAL__sub_I_Random_cpp_4065"] = asm["__GLOBAL__sub_I_Random_cpp_4065"];
var _SizeProperty_setNodeValue = Module["_SizeProperty_setNodeValue"] = asm["_SizeProperty_setNodeValue"];
var _DoubleProperty_setAllEdgeValue = Module["_DoubleProperty_setAllEdgeValue"] = asm["_DoubleProperty_setAllEdgeValue"];
var _getCurrentCanvas = Module["_getCurrentCanvas"] = asm["_getCurrentCanvas"];
var __GLOBAL__sub_I_TulipToOGDF_cpp = Module["__GLOBAL__sub_I_TulipToOGDF_cpp"] = asm["__GLOBAL__sub_I_TulipToOGDF_cpp"];
var _Camera_modelViewMatrix = Module["_Camera_modelViewMatrix"] = asm["_Camera_modelViewMatrix"];
var _stringAlgorithmsNamesLengths = Module["_stringAlgorithmsNamesLengths"] = asm["_stringAlgorithmsNamesLengths"];
var _saveSetjmp = Module["_saveSetjmp"] = asm["_saveSetjmp"];
var _DoubleProperty_getNodeValue = Module["_DoubleProperty_getNodeValue"] = asm["_DoubleProperty_getNodeValue"];
var _ColorVectorProperty_getNodeValue = Module["_ColorVectorProperty_getNodeValue"] = asm["_ColorVectorProperty_getNodeValue"];
var __GLOBAL__sub_I_OGDFFrutchermanReingold_cpp = Module["__GLOBAL__sub_I_OGDFFrutchermanReingold_cpp"] = asm["__GLOBAL__sub_I_OGDFFrutchermanReingold_cpp"];
var _randomUnsignedInteger = Module["_randomUnsignedInteger"] = asm["_randomUnsignedInteger"];
var _numberOfStringAlgorithms = Module["_numberOfStringAlgorithms"] = asm["_numberOfStringAlgorithms"];
var __GLOBAL__sub_I_Delaunay_cpp = Module["__GLOBAL__sub_I_Delaunay_cpp"] = asm["__GLOBAL__sub_I_Delaunay_cpp"];
var __GLOBAL__sub_I_PropertyTypes_cpp = Module["__GLOBAL__sub_I_PropertyTypes_cpp"] = asm["__GLOBAL__sub_I_PropertyTypes_cpp"];
var _getPluginsList = Module["_getPluginsList"] = asm["_getPluginsList"];
var _setCurrentCanvas = Module["_setCurrentCanvas"] = asm["_setCurrentCanvas"];
var _Graph_getInOutNodes = Module["_Graph_getInOutNodes"] = asm["_Graph_getInOutNodes"];
var _Graph_delAllSubGraphs = Module["_Graph_delAllSubGraphs"] = asm["_Graph_delAllSubGraphs"];
var __GLOBAL__sub_I_TreeRadial_cpp = Module["__GLOBAL__sub_I_TreeRadial_cpp"] = asm["__GLOBAL__sub_I_TreeRadial_cpp"];
var _DoubleVectorProperty_getNodeVectorSize = Module["_DoubleVectorProperty_getNodeVectorSize"] = asm["_DoubleVectorProperty_getNodeVectorSize"];
var _GlGraphInputData_getElementBorderColor = Module["_GlGraphInputData_getElementBorderColor"] = asm["_GlGraphInputData_getElementBorderColor"];
var _StringVectorProperty_setNodeValue = Module["_StringVectorProperty_setNodeValue"] = asm["_StringVectorProperty_setNodeValue"];
var __GLOBAL__sub_I_LouvainClustering_cpp = Module["__GLOBAL__sub_I_LouvainClustering_cpp"] = asm["__GLOBAL__sub_I_LouvainClustering_cpp"];
var __GLOBAL__sub_I_ColorMapping_cpp = Module["__GLOBAL__sub_I_ColorMapping_cpp"] = asm["__GLOBAL__sub_I_ColorMapping_cpp"];
var _setGraphsHullsVisible = Module["_setGraphsHullsVisible"] = asm["_setGraphsHullsVisible"];
var __GLOBAL__sub_I_OrientableLayout_cpp = Module["__GLOBAL__sub_I_OrientableLayout_cpp"] = asm["__GLOBAL__sub_I_OrientableLayout_cpp"];
var __GLOBAL__sub_I_LinkCommunities_cpp = Module["__GLOBAL__sub_I_LinkCommunities_cpp"] = asm["__GLOBAL__sub_I_LinkCommunities_cpp"];
var _Graph_getCoordVectorProperty = Module["_Graph_getCoordVectorProperty"] = asm["_Graph_getCoordVectorProperty"];
var _PropertyInterface_getName = Module["_PropertyInterface_getName"] = asm["_PropertyInterface_getName"];
var __GLOBAL__sub_I_DiamondGlyph_cpp = Module["__GLOBAL__sub_I_DiamondGlyph_cpp"] = asm["__GLOBAL__sub_I_DiamondGlyph_cpp"];
var _GlGraphRenderingParameters_minSizeOfLabels = Module["_GlGraphRenderingParameters_minSizeOfLabels"] = asm["_GlGraphRenderingParameters_minSizeOfLabels"];
var _BooleanProperty_setAllEdgeValue = Module["_BooleanProperty_setAllEdgeValue"] = asm["_BooleanProperty_setAllEdgeValue"];
var _createColorProperty = Module["_createColorProperty"] = asm["_createColorProperty"];
var _Camera_getViewport = Module["_Camera_getViewport"] = asm["_Camera_getViewport"];
var _selectEdges = Module["_selectEdges"] = asm["_selectEdges"];
var _Graph_addSubGraph2 = Module["_Graph_addSubGraph2"] = asm["_Graph_addSubGraph2"];
var _Graph_addSubGraph1 = Module["_Graph_addSubGraph1"] = asm["_Graph_addSubGraph1"];
var __GLOBAL__sub_I_EdgeBundling_cpp = Module["__GLOBAL__sub_I_EdgeBundling_cpp"] = asm["__GLOBAL__sub_I_EdgeBundling_cpp"];
var _Graph_delLocalProperty = Module["_Graph_delLocalProperty"] = asm["_Graph_delLocalProperty"];
var __GLOBAL__sub_I_StrengthClustering_cpp = Module["__GLOBAL__sub_I_StrengthClustering_cpp"] = asm["__GLOBAL__sub_I_StrengthClustering_cpp"];
var _unholdObservers = Module["_unholdObservers"] = asm["_unholdObservers"];
var __GLOBAL__sub_I_GlGraphInputData_cpp = Module["__GLOBAL__sub_I_GlGraphInputData_cpp"] = asm["__GLOBAL__sub_I_GlGraphInputData_cpp"];
var __GLOBAL__sub_I_GEMLayout_cpp = Module["__GLOBAL__sub_I_GEMLayout_cpp"] = asm["__GLOBAL__sub_I_GEMLayout_cpp"];
var __GLOBAL__sub_I_Circular_cpp = Module["__GLOBAL__sub_I_Circular_cpp"] = asm["__GLOBAL__sub_I_Circular_cpp"];
var _Graph_existEdge = Module["_Graph_existEdge"] = asm["_Graph_existEdge"];
var _Graph_getOutNodes = Module["_Graph_getOutNodes"] = asm["_Graph_getOutNodes"];
var _BooleanVectorProperty_setAllEdgeValue = Module["_BooleanVectorProperty_setAllEdgeValue"] = asm["_BooleanVectorProperty_setAllEdgeValue"];
var _Graph_loadFromTLPBFile = Module["_Graph_loadFromTLPBFile"] = asm["_Graph_loadFromTLPBFile"];
var _free = Module["_free"] = asm["_free"];
var _GlGraphRenderingParameters_billboardedNodes = Module["_GlGraphRenderingParameters_billboardedNodes"] = asm["_GlGraphRenderingParameters_billboardedNodes"];
var _DoubleVectorProperty_getEdgeDefaultValue = Module["_DoubleVectorProperty_getEdgeDefaultValue"] = asm["_DoubleVectorProperty_getEdgeDefaultValue"];
var _Graph_getProperty = Module["_Graph_getProperty"] = asm["_Graph_getProperty"];
var _getSelectedEdges = Module["_getSelectedEdges"] = asm["_getSelectedEdges"];
var _PropertyInterface_getGraph = Module["_PropertyInterface_getGraph"] = asm["_PropertyInterface_getGraph"];
var __GLOBAL__sub_I_IdMetric_cpp = Module["__GLOBAL__sub_I_IdMetric_cpp"] = asm["__GLOBAL__sub_I_IdMetric_cpp"];
var __GLOBAL__sub_I_OGDFStressMajorization_cpp = Module["__GLOBAL__sub_I_OGDFStressMajorization_cpp"] = asm["__GLOBAL__sub_I_OGDFStressMajorization_cpp"];
var _Graph_outdeg = Module["_Graph_outdeg"] = asm["_Graph_outdeg"];
var _GlGraphInputData_getElementLabelColor = Module["_GlGraphInputData_getElementLabelColor"] = asm["_GlGraphInputData_getElementLabelColor"];
var _LayoutProperty_getEdgeDefaultNumberOfBends = Module["_LayoutProperty_getEdgeDefaultNumberOfBends"] = asm["_LayoutProperty_getEdgeDefaultNumberOfBends"];
var ___cxx_global_var_init_3_328 = Module["___cxx_global_var_init_3_328"] = asm["___cxx_global_var_init_3_328"];
var _IntegerVectorProperty_getEdgeVectorSize = Module["_IntegerVectorProperty_getEdgeVectorSize"] = asm["_IntegerVectorProperty_getEdgeVectorSize"];
var _Graph_numberOfEdges = Module["_Graph_numberOfEdges"] = asm["_Graph_numberOfEdges"];
var _ColorVectorProperty_getNodeDefaultValue = Module["_ColorVectorProperty_getNodeDefaultValue"] = asm["_ColorVectorProperty_getNodeDefaultValue"];
var __GLOBAL__sub_I_RingGlyph_cpp = Module["__GLOBAL__sub_I_RingGlyph_cpp"] = asm["__GLOBAL__sub_I_RingGlyph_cpp"];
var _Camera_projectionMatrix = Module["_Camera_projectionMatrix"] = asm["_Camera_projectionMatrix"];
var _GlGraphInputData_setElementLabelColor = Module["_GlGraphInputData_setElementLabelColor"] = asm["_GlGraphInputData_setElementLabelColor"];
var _GlGraphInputData_setElementSrcAnchorShape = Module["_GlGraphInputData_setElementSrcAnchorShape"] = asm["_GlGraphInputData_setElementSrcAnchorShape"];
var _createIntegerProperty = Module["_createIntegerProperty"] = asm["_createIntegerProperty"];
var __GLOBAL__sub_I_config_cpp = Module["__GLOBAL__sub_I_config_cpp"] = asm["__GLOBAL__sub_I_config_cpp"];
var ___cxx_global_var_init_9_331 = Module["___cxx_global_var_init_9_331"] = asm["___cxx_global_var_init_9_331"];
var _importPluginExists = Module["_importPluginExists"] = asm["_importPluginExists"];
var __GLOBAL__sub_I_Glyph_cpp = Module["__GLOBAL__sub_I_Glyph_cpp"] = asm["__GLOBAL__sub_I_Glyph_cpp"];
var _GlGraphRenderingParameters_displayNodes = Module["_GlGraphRenderingParameters_displayNodes"] = asm["_GlGraphRenderingParameters_displayNodes"];
var __GLOBAL__sub_I_LassoSelectionInteractor_cpp = Module["__GLOBAL__sub_I_LassoSelectionInteractor_cpp"] = asm["__GLOBAL__sub_I_LassoSelectionInteractor_cpp"];
var _GlGraphRenderingParameters_setMinSizeOfLabels = Module["_GlGraphRenderingParameters_setMinSizeOfLabels"] = asm["_GlGraphRenderingParameters_setMinSizeOfLabels"];
var _addGraphHull = Module["_addGraphHull"] = asm["_addGraphHull"];
var _Graph_addCloneSubGraph = Module["_Graph_addCloneSubGraph"] = asm["_Graph_addCloneSubGraph"];
var _Graph_numberOfDescendantGraphs = Module["_Graph_numberOfDescendantGraphs"] = asm["_Graph_numberOfDescendantGraphs"];
var _ColorVectorProperty_setAllEdgeValue = Module["_ColorVectorProperty_setAllEdgeValue"] = asm["_ColorVectorProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_OrientableSize_cpp = Module["__GLOBAL__sub_I_OrientableSize_cpp"] = asm["__GLOBAL__sub_I_OrientableSize_cpp"];
var __GLOBAL__sub_I_dotImport_cpp = Module["__GLOBAL__sub_I_dotImport_cpp"] = asm["__GLOBAL__sub_I_dotImport_cpp"];
var __GLOBAL__sub_I_TreeTest_cpp = Module["__GLOBAL__sub_I_TreeTest_cpp"] = asm["__GLOBAL__sub_I_TreeTest_cpp"];
var _ColorVectorProperty_setNodeValue = Module["_ColorVectorProperty_setNodeValue"] = asm["_ColorVectorProperty_setNodeValue"];
var _IntegerVectorProperty_setNodeValue = Module["_IntegerVectorProperty_setNodeValue"] = asm["_IntegerVectorProperty_setNodeValue"];
var _GlGraphInputData_setElementLabelPosition = Module["_GlGraphInputData_setElementLabelPosition"] = asm["_GlGraphInputData_setElementLabelPosition"];
var __GLOBAL__sub_I_RandomSimpleGraph_cpp = Module["__GLOBAL__sub_I_RandomSimpleGraph_cpp"] = asm["__GLOBAL__sub_I_RandomSimpleGraph_cpp"];
var _sizeAlgorithmExists = Module["_sizeAlgorithmExists"] = asm["_sizeAlgorithmExists"];
var _GlGraphRenderingParameters_setDisplayEdges = Module["_GlGraphRenderingParameters_setDisplayEdges"] = asm["_GlGraphRenderingParameters_setDisplayEdges"];
var __GLOBAL__sub_I_GlUtils_cpp = Module["__GLOBAL__sub_I_GlUtils_cpp"] = asm["__GLOBAL__sub_I_GlUtils_cpp"];
var _ColorScale_setColorAtPos = Module["_ColorScale_setColorAtPos"] = asm["_ColorScale_setColorAtPos"];
var __GLOBAL__sub_I_PropertyManager_cpp = Module["__GLOBAL__sub_I_PropertyManager_cpp"] = asm["__GLOBAL__sub_I_PropertyManager_cpp"];
var _DoubleProperty_getNodeDefaultValue = Module["_DoubleProperty_getNodeDefaultValue"] = asm["_DoubleProperty_getNodeDefaultValue"];
var _GlGraphRenderingParameters_interpolateEdgesColors = Module["_GlGraphRenderingParameters_interpolateEdgesColors"] = asm["_GlGraphRenderingParameters_interpolateEdgesColors"];
var _GlGraphInputData_setElementRotation = Module["_GlGraphInputData_setElementRotation"] = asm["_GlGraphInputData_setElementRotation"];
var _Graph_applyPropertyAlgorithm = Module["_Graph_applyPropertyAlgorithm"] = asm["_Graph_applyPropertyAlgorithm"];
var _Graph_dfs = Module["_Graph_dfs"] = asm["_Graph_dfs"];
var _BooleanVectorProperty_getNodeDefaultVectorSize = Module["_BooleanVectorProperty_getNodeDefaultVectorSize"] = asm["_BooleanVectorProperty_getNodeDefaultVectorSize"];
var _GlGraphInputData_setElementTgtAnchorSize = Module["_GlGraphInputData_setElementTgtAnchorSize"] = asm["_GlGraphInputData_setElementTgtAnchorSize"];
var _GlGraphInputData_getElementLabelPosition = Module["_GlGraphInputData_getElementLabelPosition"] = asm["_GlGraphInputData_getElementLabelPosition"];
var __GLOBAL__sub_I_RandomGraph_cpp = Module["__GLOBAL__sub_I_RandomGraph_cpp"] = asm["__GLOBAL__sub_I_RandomGraph_cpp"];
var _BooleanVectorProperty_getEdgeValue = Module["_BooleanVectorProperty_getEdgeValue"] = asm["_BooleanVectorProperty_getEdgeValue"];
var __GLOBAL__sub_I_Dijkstra_cpp = Module["__GLOBAL__sub_I_Dijkstra_cpp"] = asm["__GLOBAL__sub_I_Dijkstra_cpp"];
var _IntegerProperty_setNodeValue = Module["_IntegerProperty_setNodeValue"] = asm["_IntegerProperty_setNodeValue"];
var _BooleanProperty_setEdgeValue = Module["_BooleanProperty_setEdgeValue"] = asm["_BooleanProperty_setEdgeValue"];
var __GLOBAL__sub_I_ReachableSubGraphSelection_cpp = Module["__GLOBAL__sub_I_ReachableSubGraphSelection_cpp"] = asm["__GLOBAL__sub_I_ReachableSubGraphSelection_cpp"];
var _GlGraphInputData_setElementLabel = Module["_GlGraphInputData_setElementLabel"] = asm["_GlGraphInputData_setElementLabel"];
var _StringVectorProperty_getNodeDefaultValue = Module["_StringVectorProperty_getNodeDefaultValue"] = asm["_StringVectorProperty_getNodeDefaultValue"];
var __GLOBAL__sub_I_PolyominoPacking_cpp = Module["__GLOBAL__sub_I_PolyominoPacking_cpp"] = asm["__GLOBAL__sub_I_PolyominoPacking_cpp"];
var __GLOBAL__sub_I_LayoutStandards_cpp = Module["__GLOBAL__sub_I_LayoutStandards_cpp"] = asm["__GLOBAL__sub_I_LayoutStandards_cpp"];
var __GLOBAL__sub_I_HierarchicalClustering_cpp = Module["__GLOBAL__sub_I_HierarchicalClustering_cpp"] = asm["__GLOBAL__sub_I_HierarchicalClustering_cpp"];
var _StringVectorProperty_getNodeDefaultStringsLengths = Module["_StringVectorProperty_getNodeDefaultStringsLengths"] = asm["_StringVectorProperty_getNodeDefaultStringsLengths"];
var __GLOBAL__sub_I_Ogml_cpp = Module["__GLOBAL__sub_I_Ogml_cpp"] = asm["__GLOBAL__sub_I_Ogml_cpp"];
var __GLOBAL__sub_I_OGDFBalloon_cpp = Module["__GLOBAL__sub_I_OGDFBalloon_cpp"] = asm["__GLOBAL__sub_I_OGDFBalloon_cpp"];
var _setSeedOfRandomSequence = Module["_setSeedOfRandomSequence"] = asm["_setSeedOfRandomSequence"];
var _doubleAlgorithmExists = Module["_doubleAlgorithmExists"] = asm["_doubleAlgorithmExists"];
var _GlGraphInputData_setElementFontAwesomeIcon = Module["_GlGraphInputData_setElementFontAwesomeIcon"] = asm["_GlGraphInputData_setElementFontAwesomeIcon"];
var _ColorScale_newColorScale = Module["_ColorScale_newColorScale"] = asm["_ColorScale_newColorScale"];
var _Graph_getStringVectorProperty = Module["_Graph_getStringVectorProperty"] = asm["_Graph_getStringVectorProperty"];
var __GLOBAL__sub_I_CylinderGlyph_cpp = Module["__GLOBAL__sub_I_CylinderGlyph_cpp"] = asm["__GLOBAL__sub_I_CylinderGlyph_cpp"];
var _GlGraphInputData_reloadGraphProperties = Module["_GlGraphInputData_reloadGraphProperties"] = asm["_GlGraphInputData_reloadGraphProperties"];
var ___cxx_global_var_init_22 = Module["___cxx_global_var_init_22"] = asm["___cxx_global_var_init_22"];
var _initRandomSequence = Module["_initRandomSequence"] = asm["_initRandomSequence"];
var _SizeProperty_getNodeDefaultValue = Module["_SizeProperty_getNodeDefaultValue"] = asm["_SizeProperty_getNodeDefaultValue"];
var ___cxx_global_var_init_21 = Module["___cxx_global_var_init_21"] = asm["___cxx_global_var_init_21"];
var __GLOBAL__sub_I_ZoomAndPanInteractor_cpp = Module["__GLOBAL__sub_I_ZoomAndPanInteractor_cpp"] = asm["__GLOBAL__sub_I_ZoomAndPanInteractor_cpp"];
var _BooleanVectorProperty_setEdgeValue = Module["_BooleanVectorProperty_setEdgeValue"] = asm["_BooleanVectorProperty_setEdgeValue"];
var __GLOBAL__sub_I_Kruskal_cpp = Module["__GLOBAL__sub_I_Kruskal_cpp"] = asm["__GLOBAL__sub_I_Kruskal_cpp"];
var __GLOBAL__sub_I_GraphIO_svg_cpp = Module["__GLOBAL__sub_I_GraphIO_svg_cpp"] = asm["__GLOBAL__sub_I_GraphIO_svg_cpp"];
var __GLOBAL__sub_I_Tree_cpp = Module["__GLOBAL__sub_I_Tree_cpp"] = asm["__GLOBAL__sub_I_Tree_cpp"];
var _layoutAlgorithmExists = Module["_layoutAlgorithmExists"] = asm["_layoutAlgorithmExists"];
var __GLOBAL__sub_I_StlFunctions_cpp = Module["__GLOBAL__sub_I_StlFunctions_cpp"] = asm["__GLOBAL__sub_I_StlFunctions_cpp"];
var __GLOBAL__sub_I_OGDFLayoutPluginBase_cpp = Module["__GLOBAL__sub_I_OGDFLayoutPluginBase_cpp"] = asm["__GLOBAL__sub_I_OGDFLayoutPluginBase_cpp"];
var __GLOBAL__sub_I_iostream_cpp = Module["__GLOBAL__sub_I_iostream_cpp"] = asm["__GLOBAL__sub_I_iostream_cpp"];
var _ColorVectorProperty_getNodeDefaultVectorSize = Module["_ColorVectorProperty_getNodeDefaultVectorSize"] = asm["_ColorVectorProperty_getNodeDefaultVectorSize"];
var _integerAlgorithmExists = Module["_integerAlgorithmExists"] = asm["_integerAlgorithmExists"];
var _GlGraphInputData_getElementGlowColor = Module["_GlGraphInputData_getElementGlowColor"] = asm["_GlGraphInputData_getElementGlowColor"];
var _testSetjmp = Module["_testSetjmp"] = asm["_testSetjmp"];
var _Graph_isConnected = Module["_Graph_isConnected"] = asm["_Graph_isConnected"];
var __GLOBAL__sub_I_GlyphsManager_cpp = Module["__GLOBAL__sub_I_GlyphsManager_cpp"] = asm["__GLOBAL__sub_I_GlyphsManager_cpp"];
var __GLOBAL__sub_I_Dendrogram_cpp = Module["__GLOBAL__sub_I_Dendrogram_cpp"] = asm["__GLOBAL__sub_I_Dendrogram_cpp"];
var _integerAlgorithmsNamesLengths = Module["_integerAlgorithmsNamesLengths"] = asm["_integerAlgorithmsNamesLengths"];
var _Graph_pop = Module["_Graph_pop"] = asm["_Graph_pop"];
var _Graph_setEnds = Module["_Graph_setEnds"] = asm["_Graph_setEnds"];
var __GLOBAL__sub_I_DegreeMetric_cpp = Module["__GLOBAL__sub_I_DegreeMetric_cpp"] = asm["__GLOBAL__sub_I_DegreeMetric_cpp"];
var _GlGraphRenderingParameters_setInterpolateEdgesColors = Module["_GlGraphRenderingParameters_setInterpolateEdgesColors"] = asm["_GlGraphRenderingParameters_setInterpolateEdgesColors"];
var _StringProperty_getNodeValue = Module["_StringProperty_getNodeValue"] = asm["_StringProperty_getNodeValue"];
var __GLOBAL__sub_I_DepthMetric_cpp = Module["__GLOBAL__sub_I_DepthMetric_cpp"] = asm["__GLOBAL__sub_I_DepthMetric_cpp"];
var _getAlgorithmPluginsList = Module["_getAlgorithmPluginsList"] = asm["_getAlgorithmPluginsList"];
var _createDoubleProperty = Module["_createDoubleProperty"] = asm["_createDoubleProperty"];
var _colorAlgorithmExists = Module["_colorAlgorithmExists"] = asm["_colorAlgorithmExists"];
var _BooleanProperty_setNodeValue = Module["_BooleanProperty_setNodeValue"] = asm["_BooleanProperty_setNodeValue"];
var _ColorProperty_getNodeValue = Module["_ColorProperty_getNodeValue"] = asm["_ColorProperty_getNodeValue"];
var _GlGraphInputData_getElementSrcAnchorShape = Module["_GlGraphInputData_getElementSrcAnchorShape"] = asm["_GlGraphInputData_getElementSrcAnchorShape"];
var _BooleanProperty_getEdgeDefaultValue = Module["_BooleanProperty_getEdgeDefaultValue"] = asm["_BooleanProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_MultipleEdgeSelection_cpp = Module["__GLOBAL__sub_I_MultipleEdgeSelection_cpp"] = asm["__GLOBAL__sub_I_MultipleEdgeSelection_cpp"];
var _fflush = Module["_fflush"] = asm["_fflush"];
var ___cxx_global_var_init_9 = Module["___cxx_global_var_init_9"] = asm["___cxx_global_var_init_9"];
var ___cxx_global_var_init_5 = Module["___cxx_global_var_init_5"] = asm["___cxx_global_var_init_5"];
var _Graph_getLocalSizeVectorProperty = Module["_Graph_getLocalSizeVectorProperty"] = asm["_Graph_getLocalSizeVectorProperty"];
var ___cxx_global_var_init_7 = Module["___cxx_global_var_init_7"] = asm["___cxx_global_var_init_7"];
var _Graph_newGraph = Module["_Graph_newGraph"] = asm["_Graph_newGraph"];
var __GLOBAL__sub_I_DagLevelMetric_cpp = Module["__GLOBAL__sub_I_DagLevelMetric_cpp"] = asm["__GLOBAL__sub_I_DagLevelMetric_cpp"];
var ___cxx_global_var_init_3 = Module["___cxx_global_var_init_3"] = asm["___cxx_global_var_init_3"];
var _DoubleVectorProperty_setNodeValue = Module["_DoubleVectorProperty_setNodeValue"] = asm["_DoubleVectorProperty_setNodeValue"];
var __GLOBAL__sub_I_BiconnectedComponent_cpp = Module["__GLOBAL__sub_I_BiconnectedComponent_cpp"] = asm["__GLOBAL__sub_I_BiconnectedComponent_cpp"];
var _IntegerProperty_setAllEdgeValue = Module["_IntegerProperty_setAllEdgeValue"] = asm["_IntegerProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_LayoutProperty_cpp = Module["__GLOBAL__sub_I_LayoutProperty_cpp"] = asm["__GLOBAL__sub_I_LayoutProperty_cpp"];
var _Graph_setName = Module["_Graph_setName"] = asm["_Graph_setName"];
var _DoubleVectorProperty_setEdgeValue = Module["_DoubleVectorProperty_setEdgeValue"] = asm["_DoubleVectorProperty_setEdgeValue"];
var __GLOBAL__sub_I_TulipFontAwesome_cpp = Module["__GLOBAL__sub_I_TulipFontAwesome_cpp"] = asm["__GLOBAL__sub_I_TulipFontAwesome_cpp"];
var __GLOBAL__sub_I_Graph_cpp = Module["__GLOBAL__sub_I_Graph_cpp"] = asm["__GLOBAL__sub_I_Graph_cpp"];
var _clearGraphsHulls = Module["_clearGraphsHulls"] = asm["_clearGraphsHulls"];
var __GLOBAL__sub_I_TLPImport_cpp = Module["__GLOBAL__sub_I_TLPImport_cpp"] = asm["__GLOBAL__sub_I_TLPImport_cpp"];
var _BooleanProperty_getNodeDefaultValue = Module["_BooleanProperty_getNodeDefaultValue"] = asm["_BooleanProperty_getNodeDefaultValue"];
var _StringVectorProperty_getNodeValue = Module["_StringVectorProperty_getNodeValue"] = asm["_StringVectorProperty_getNodeValue"];
var _pthread_mutex_unlock = Module["_pthread_mutex_unlock"] = asm["_pthread_mutex_unlock"];
var __GLOBAL__sub_I_FontIconGlyph_cpp = Module["__GLOBAL__sub_I_FontIconGlyph_cpp"] = asm["__GLOBAL__sub_I_FontIconGlyph_cpp"];
var __GLOBAL__sub_I_GraphAbstract_cpp = Module["__GLOBAL__sub_I_GraphAbstract_cpp"] = asm["__GLOBAL__sub_I_GraphAbstract_cpp"];
var __GLOBAL__sub_I_HierarchicalGraph_cpp = Module["__GLOBAL__sub_I_HierarchicalGraph_cpp"] = asm["__GLOBAL__sub_I_HierarchicalGraph_cpp"];
var _Graph_getDoubleVectorProperty = Module["_Graph_getDoubleVectorProperty"] = asm["_Graph_getDoubleVectorProperty"];
var _Graph_delEdge = Module["_Graph_delEdge"] = asm["_Graph_delEdge"];
var _StringVectorProperty_getEdgeDefaultValue = Module["_StringVectorProperty_getEdgeDefaultValue"] = asm["_StringVectorProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_RandomTreeGeneral_cpp = Module["__GLOBAL__sub_I_RandomTreeGeneral_cpp"] = asm["__GLOBAL__sub_I_RandomTreeGeneral_cpp"];
var __GLOBAL__sub_I_PropertyAlgorithm_cpp = Module["__GLOBAL__sub_I_PropertyAlgorithm_cpp"] = asm["__GLOBAL__sub_I_PropertyAlgorithm_cpp"];
var ___errno_location = Module["___errno_location"] = asm["___errno_location"];
var _GlGraphInputData_getElementColor = Module["_GlGraphInputData_getElementColor"] = asm["_GlGraphInputData_getElementColor"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _getBooleanAlgorithmPluginsList = Module["_getBooleanAlgorithmPluginsList"] = asm["_getBooleanAlgorithmPluginsList"];
var _Graph_propertiesNamesLengths = Module["_Graph_propertiesNamesLengths"] = asm["_Graph_propertiesNamesLengths"];
var __GLOBAL__sub_I_DelaunayTriangulation_cpp = Module["__GLOBAL__sub_I_DelaunayTriangulation_cpp"] = asm["__GLOBAL__sub_I_DelaunayTriangulation_cpp"];
var _Graph_addEdges2 = Module["_Graph_addEdges2"] = asm["_Graph_addEdges2"];
var __GLOBAL__sub_I_FisheyeInteractor_cpp = Module["__GLOBAL__sub_I_FisheyeInteractor_cpp"] = asm["__GLOBAL__sub_I_FisheyeInteractor_cpp"];
var _BooleanVectorProperty_setNodeValue = Module["_BooleanVectorProperty_setNodeValue"] = asm["_BooleanVectorProperty_setNodeValue"];
var _ColorProperty_setAllEdgeValue = Module["_ColorProperty_setAllEdgeValue"] = asm["_ColorProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_FastOverlapRemoval_cpp = Module["__GLOBAL__sub_I_FastOverlapRemoval_cpp"] = asm["__GLOBAL__sub_I_FastOverlapRemoval_cpp"];
var __GLOBAL__sub_I_SquareGlyph_cpp = Module["__GLOBAL__sub_I_SquareGlyph_cpp"] = asm["__GLOBAL__sub_I_SquareGlyph_cpp"];
var _LayoutProperty_getMin = Module["_LayoutProperty_getMin"] = asm["_LayoutProperty_getMin"];
var __GLOBAL__sub_I_main_cpp = Module["__GLOBAL__sub_I_main_cpp"] = asm["__GLOBAL__sub_I_main_cpp"];
var _Graph_delSubGraph = Module["_Graph_delSubGraph"] = asm["_Graph_delSubGraph"];
var _BooleanProperty_getNodesEqualTo = Module["_BooleanProperty_getNodesEqualTo"] = asm["_BooleanProperty_getNodesEqualTo"];
var _booleanAlgorithmsNamesLengths = Module["_booleanAlgorithmsNamesLengths"] = asm["_booleanAlgorithmsNamesLengths"];
var _GlGraphRenderingParameters_setDisplayNodesLabels = Module["_GlGraphRenderingParameters_setDisplayNodesLabels"] = asm["_GlGraphRenderingParameters_setDisplayNodesLabels"];
var _getSeedOfRandomSequence = Module["_getSeedOfRandomSequence"] = asm["_getSeedOfRandomSequence"];
var __GLOBAL__sub_I_ToLabels_cpp = Module["__GLOBAL__sub_I_ToLabels_cpp"] = asm["__GLOBAL__sub_I_ToLabels_cpp"];
var __GLOBAL__sub_I_StrengthMetric_cpp = Module["__GLOBAL__sub_I_StrengthMetric_cpp"] = asm["__GLOBAL__sub_I_StrengthMetric_cpp"];
var _Graph_getLayoutProperty = Module["_Graph_getLayoutProperty"] = asm["_Graph_getLayoutProperty"];
var _PropertyInterface_getTypename = Module["_PropertyInterface_getTypename"] = asm["_PropertyInterface_getTypename"];
var _ColorScale_getOffsets = Module["_ColorScale_getOffsets"] = asm["_ColorScale_getOffsets"];
var _Graph_getLocalStringVectorProperty = Module["_Graph_getLocalStringVectorProperty"] = asm["_Graph_getLocalStringVectorProperty"];
var __GLOBAL__sub_I_SizeProperty_cpp = Module["__GLOBAL__sub_I_SizeProperty_cpp"] = asm["__GLOBAL__sub_I_SizeProperty_cpp"];
var _Graph_clear = Module["_Graph_clear"] = asm["_Graph_clear"];
var _ColorProperty_setNodeValue = Module["_ColorProperty_setNodeValue"] = asm["_ColorProperty_setNodeValue"];
var _DoubleProperty_setNodeValue = Module["_DoubleProperty_setNodeValue"] = asm["_DoubleProperty_setNodeValue"];
var _DoubleProperty_getEdgeValue = Module["_DoubleProperty_getEdgeValue"] = asm["_DoubleProperty_getEdgeValue"];
var __GLOBAL__sub_I_TreeReingoldAndTilfordExtended_cpp = Module["__GLOBAL__sub_I_TreeReingoldAndTilfordExtended_cpp"] = asm["__GLOBAL__sub_I_TreeReingoldAndTilfordExtended_cpp"];
var _centerScene = Module["_centerScene"] = asm["_centerScene"];
var _IntegerVectorProperty_getNodeValue = Module["_IntegerVectorProperty_getNodeValue"] = asm["_IntegerVectorProperty_getNodeValue"];
var __GLOBAL__sub_I_HexagonGlyph_cpp = Module["__GLOBAL__sub_I_HexagonGlyph_cpp"] = asm["__GLOBAL__sub_I_HexagonGlyph_cpp"];
var _graphHasHull = Module["_graphHasHull"] = asm["_graphHasHull"];
var __GLOBAL__sub_I_Grip_cpp = Module["__GLOBAL__sub_I_Grip_cpp"] = asm["__GLOBAL__sub_I_Grip_cpp"];
var _Graph_getColorVectorProperty = Module["_Graph_getColorVectorProperty"] = asm["_Graph_getColorVectorProperty"];
var __GLOBAL__I_000101 = Module["__GLOBAL__I_000101"] = asm["__GLOBAL__I_000101"];
var _StringProperty_getEdgeDefaultValue = Module["_StringProperty_getEdgeDefaultValue"] = asm["_StringProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_CompleteTree_cpp = Module["__GLOBAL__sub_I_CompleteTree_cpp"] = asm["__GLOBAL__sub_I_CompleteTree_cpp"];
var _createBooleanProperty = Module["_createBooleanProperty"] = asm["_createBooleanProperty"];
var _Graph_getIntegerVectorProperty = Module["_Graph_getIntegerVectorProperty"] = asm["_Graph_getIntegerVectorProperty"];
var __GLOBAL__sub_I_ColorProperty_cpp = Module["__GLOBAL__sub_I_ColorProperty_cpp"] = asm["__GLOBAL__sub_I_ColorProperty_cpp"];
var ___cxa_can_catch = Module["___cxa_can_catch"] = asm["___cxa_can_catch"];
var _GlGraphRenderingParameters_labelsScaled = Module["_GlGraphRenderingParameters_labelsScaled"] = asm["_GlGraphRenderingParameters_labelsScaled"];
var _Graph_indeg = Module["_Graph_indeg"] = asm["_Graph_indeg"];
var _Graph_getBooleanVectorProperty = Module["_Graph_getBooleanVectorProperty"] = asm["_Graph_getBooleanVectorProperty"];
var _numberOfSizeAlgorithms = Module["_numberOfSizeAlgorithms"] = asm["_numberOfSizeAlgorithms"];
var _IntegerVectorProperty_getNodeDefaultValue = Module["_IntegerVectorProperty_getNodeDefaultValue"] = asm["_IntegerVectorProperty_getNodeDefaultValue"];
var _GlGraphInputData_setElementBorderWidth = Module["_GlGraphInputData_setElementBorderWidth"] = asm["_GlGraphInputData_setElementBorderWidth"];
var _LayoutProperty_getNodeValue = Module["_LayoutProperty_getNodeValue"] = asm["_LayoutProperty_getNodeValue"];
var _GlGraphRenderingParameters_maxSizeOfLabels = Module["_GlGraphRenderingParameters_maxSizeOfLabels"] = asm["_GlGraphRenderingParameters_maxSizeOfLabels"];
var _GlGraphRenderingParameters_setElementsOrdered = Module["_GlGraphRenderingParameters_setElementsOrdered"] = asm["_GlGraphRenderingParameters_setElementsOrdered"];
var _SizeProperty_getMin = Module["_SizeProperty_getMin"] = asm["_SizeProperty_getMin"];
var _ColorScale_setColorScale = Module["_ColorScale_setColorScale"] = asm["_ColorScale_setColorScale"];
var ___cxx_global_var_init_29 = Module["___cxx_global_var_init_29"] = asm["___cxx_global_var_init_29"];
var __GLOBAL__sub_I_ParametricCurves_cpp = Module["__GLOBAL__sub_I_ParametricCurves_cpp"] = asm["__GLOBAL__sub_I_ParametricCurves_cpp"];
var _createStringVectorProperty = Module["_createStringVectorProperty"] = asm["_createStringVectorProperty"];
var _getColorAlgorithmPluginsList = Module["_getColorAlgorithmPluginsList"] = asm["_getColorAlgorithmPluginsList"];
var ___cxx_global_var_init_27 = Module["___cxx_global_var_init_27"] = asm["___cxx_global_var_init_27"];
var ___cxx_global_var_init_25 = Module["___cxx_global_var_init_25"] = asm["___cxx_global_var_init_25"];
var ___cxx_global_var_init_24 = Module["___cxx_global_var_init_24"] = asm["___cxx_global_var_init_24"];
var __GLOBAL__sub_I_ImprovedWalker_cpp = Module["__GLOBAL__sub_I_ImprovedWalker_cpp"] = asm["__GLOBAL__sub_I_ImprovedWalker_cpp"];
var _ColorProperty_setAllNodeValue = Module["_ColorProperty_setAllNodeValue"] = asm["_ColorProperty_setAllNodeValue"];
var _GlGraphRenderingParameters_elementsOrderingProperty = Module["_GlGraphRenderingParameters_elementsOrderingProperty"] = asm["_GlGraphRenderingParameters_elementsOrderingProperty"];
var __GLOBAL__sub_I_Bfs_cpp = Module["__GLOBAL__sub_I_Bfs_cpp"] = asm["__GLOBAL__sub_I_Bfs_cpp"];
var _BooleanProperty_setAllNodeValue = Module["_BooleanProperty_setAllNodeValue"] = asm["_BooleanProperty_setAllNodeValue"];
var _ColorVectorProperty_setAllNodeValue = Module["_ColorVectorProperty_setAllNodeValue"] = asm["_ColorVectorProperty_setAllNodeValue"];
var _LayoutProperty_perfectAspectRatio = Module["_LayoutProperty_perfectAspectRatio"] = asm["_LayoutProperty_perfectAspectRatio"];
var _GlGraphRenderingParameters_setEdges3D = Module["_GlGraphRenderingParameters_setEdges3D"] = asm["_GlGraphRenderingParameters_setEdges3D"];
var ___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = asm["___cxa_is_pointer_type"];
var _numberOfLayoutAlgorithms = Module["_numberOfLayoutAlgorithms"] = asm["_numberOfLayoutAlgorithms"];
var _Camera_setModelViewMatrix = Module["_Camera_setModelViewMatrix"] = asm["_Camera_setModelViewMatrix"];
var __GLOBAL__sub_I_OGDFGemFrick_cpp = Module["__GLOBAL__sub_I_OGDFGemFrick_cpp"] = asm["__GLOBAL__sub_I_OGDFGemFrick_cpp"];
var _numberOfColorAlgorithms = Module["_numberOfColorAlgorithms"] = asm["_numberOfColorAlgorithms"];
var __GLOBAL__sub_I_StrahlerMetric_cpp = Module["__GLOBAL__sub_I_StrahlerMetric_cpp"] = asm["__GLOBAL__sub_I_StrahlerMetric_cpp"];
var _ColorVectorProperty_getEdgeDefaultValue = Module["_ColorVectorProperty_getEdgeDefaultValue"] = asm["_ColorVectorProperty_getEdgeDefaultValue"];
var _createSizeProperty = Module["_createSizeProperty"] = asm["_createSizeProperty"];
var _Graph_setEventsActivated = Module["_Graph_setEventsActivated"] = asm["_Graph_setEventsActivated"];
var __GLOBAL__sub_I_ShaderManager_cpp = Module["__GLOBAL__sub_I_ShaderManager_cpp"] = asm["__GLOBAL__sub_I_ShaderManager_cpp"];
var _DoubleProperty_getEdgeDefaultValue = Module["_DoubleProperty_getEdgeDefaultValue"] = asm["_DoubleProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_SelectionModifierInteractor_cpp = Module["__GLOBAL__sub_I_SelectionModifierInteractor_cpp"] = asm["__GLOBAL__sub_I_SelectionModifierInteractor_cpp"];
var __GLOBAL__sub_I_PentagonGlyph_cpp = Module["__GLOBAL__sub_I_PentagonGlyph_cpp"] = asm["__GLOBAL__sub_I_PentagonGlyph_cpp"];
var __GLOBAL__sub_I_LoopSelection_cpp = Module["__GLOBAL__sub_I_LoopSelection_cpp"] = asm["__GLOBAL__sub_I_LoopSelection_cpp"];
var _DoubleVectorProperty_getEdgeVectorSize = Module["_DoubleVectorProperty_getEdgeVectorSize"] = asm["_DoubleVectorProperty_getEdgeVectorSize"];
var _GlGraphRenderingParameters_elementsOrderedDescending = Module["_GlGraphRenderingParameters_elementsOrderedDescending"] = asm["_GlGraphRenderingParameters_elementsOrderedDescending"];
var _Graph_swapEdgeOrder = Module["_Graph_swapEdgeOrder"] = asm["_Graph_swapEdgeOrder"];
var _getJSONGraph = Module["_getJSONGraph"] = asm["_getJSONGraph"];
var _createDoubleVectorProperty = Module["_createDoubleVectorProperty"] = asm["_createDoubleVectorProperty"];
var _SizeProperty_getEdgeDefaultValue = Module["_SizeProperty_getEdgeDefaultValue"] = asm["_SizeProperty_getEdgeDefaultValue"];
var _GlGraphInputData_getElementFontAwesomeIcon = Module["_GlGraphInputData_getElementFontAwesomeIcon"] = asm["_GlGraphInputData_getElementFontAwesomeIcon"];
var __GLOBAL__sub_I_ConeGlyph_cpp = Module["__GLOBAL__sub_I_ConeGlyph_cpp"] = asm["__GLOBAL__sub_I_ConeGlyph_cpp"];
var __GLOBAL__sub_I_EqualValueClustering_cpp = Module["__GLOBAL__sub_I_EqualValueClustering_cpp"] = asm["__GLOBAL__sub_I_EqualValueClustering_cpp"];
var _Graph_getLocalBooleanProperty = Module["_Graph_getLocalBooleanProperty"] = asm["_Graph_getLocalBooleanProperty"];
var __GLOBAL__sub_I_TLPBImport_cpp = Module["__GLOBAL__sub_I_TLPBImport_cpp"] = asm["__GLOBAL__sub_I_TLPBImport_cpp"];
var _Graph_getSuperGraph = Module["_Graph_getSuperGraph"] = asm["_Graph_getSuperGraph"];
var _getViewCamera = Module["_getViewCamera"] = asm["_getViewCamera"];
var __GLOBAL__sub_I_CurveEdges_cpp = Module["__GLOBAL__sub_I_CurveEdges_cpp"] = asm["__GLOBAL__sub_I_CurveEdges_cpp"];
var __GLOBAL__sub_I_OGDFFastMultipoleEmbedder_cpp = Module["__GLOBAL__sub_I_OGDFFastMultipoleEmbedder_cpp"] = asm["__GLOBAL__sub_I_OGDFFastMultipoleEmbedder_cpp"];
var _stringAlgorithmExists = Module["_stringAlgorithmExists"] = asm["_stringAlgorithmExists"];
var __GLOBAL__sub_I_SphereGlyph_cpp = Module["__GLOBAL__sub_I_SphereGlyph_cpp"] = asm["__GLOBAL__sub_I_SphereGlyph_cpp"];
var __GLOBAL__sub_I_PageRank_cpp = Module["__GLOBAL__sub_I_PageRank_cpp"] = asm["__GLOBAL__sub_I_PageRank_cpp"];
var _ColorProperty_getEdgeDefaultValue = Module["_ColorProperty_getEdgeDefaultValue"] = asm["_ColorProperty_getEdgeDefaultValue"];
var __GLOBAL__sub_I_Orientation_cpp = Module["__GLOBAL__sub_I_Orientation_cpp"] = asm["__GLOBAL__sub_I_Orientation_cpp"];
var _LayoutProperty_getNodeDefaultValue = Module["_LayoutProperty_getNodeDefaultValue"] = asm["_LayoutProperty_getNodeDefaultValue"];
var _importPluginsNamesLengths = Module["_importPluginsNamesLengths"] = asm["_importPluginsNamesLengths"];
var __GLOBAL__sub_I_TreeLeaf_cpp = Module["__GLOBAL__sub_I_TreeLeaf_cpp"] = asm["__GLOBAL__sub_I_TreeLeaf_cpp"];
var _Graph_setTarget = Module["_Graph_setTarget"] = asm["_Graph_setTarget"];
var _StringProperty_setEdgeValue = Module["_StringProperty_setEdgeValue"] = asm["_StringProperty_setEdgeValue"];
var _Graph_isSubGraph = Module["_Graph_isSubGraph"] = asm["_Graph_isSubGraph"];
var _Graph_getLocalBooleanVectorProperty = Module["_Graph_getLocalBooleanVectorProperty"] = asm["_Graph_getLocalBooleanVectorProperty"];
var __GLOBAL__sub_I_Triconnected_cpp = Module["__GLOBAL__sub_I_Triconnected_cpp"] = asm["__GLOBAL__sub_I_Triconnected_cpp"];
var _GlGraphInputData_setElementSelection = Module["_GlGraphInputData_setElementSelection"] = asm["_GlGraphInputData_setElementSelection"];
var __GLOBAL__sub_I_KCores_cpp = Module["__GLOBAL__sub_I_KCores_cpp"] = asm["__GLOBAL__sub_I_KCores_cpp"];
var __GLOBAL__sub_I_TulipHtml5_cpp = Module["__GLOBAL__sub_I_TulipHtml5_cpp"] = asm["__GLOBAL__sub_I_TulipHtml5_cpp"];
var _Graph_getColorProperty = Module["_Graph_getColorProperty"] = asm["_Graph_getColorProperty"];
var _algorithmExists = Module["_algorithmExists"] = asm["_algorithmExists"];
var _createColorVectorProperty = Module["_createColorVectorProperty"] = asm["_createColorVectorProperty"];
var _StringVectorProperty_getEdgeStringsLengths = Module["_StringVectorProperty_getEdgeStringsLengths"] = asm["_StringVectorProperty_getEdgeStringsLengths"];
var _GlGraphRenderingParameters_setElementOrderedDescending = Module["_GlGraphRenderingParameters_setElementOrderedDescending"] = asm["_GlGraphRenderingParameters_setElementOrderedDescending"];
var _GlGraphInputData_setElementBorderColor = Module["_GlGraphInputData_setElementBorderColor"] = asm["_GlGraphInputData_setElementBorderColor"];
var _Graph_getOutEdges = Module["_Graph_getOutEdges"] = asm["_Graph_getOutEdges"];
var _GlGraphInputData_getElementShape = Module["_GlGraphInputData_getElementShape"] = asm["_GlGraphInputData_getElementShape"];
var _Graph_getId = Module["_Graph_getId"] = asm["_Graph_getId"];
var _DoubleVectorProperty_getEdgeValue = Module["_DoubleVectorProperty_getEdgeValue"] = asm["_DoubleVectorProperty_getEdgeValue"];
var __GLOBAL__sub_I_OGDFDavidsonHarel_cpp = Module["__GLOBAL__sub_I_OGDFDavidsonHarel_cpp"] = asm["__GLOBAL__sub_I_OGDFDavidsonHarel_cpp"];
var _Graph_addNodes1 = Module["_Graph_addNodes1"] = asm["_Graph_addNodes1"];
var _Graph_addNodes2 = Module["_Graph_addNodes2"] = asm["_Graph_addNodes2"];
var _LayoutProperty_getEdgeNumberOfBends = Module["_LayoutProperty_getEdgeNumberOfBends"] = asm["_LayoutProperty_getEdgeNumberOfBends"];
var __GLOBAL__sub_I_Observable_cpp = Module["__GLOBAL__sub_I_Observable_cpp"] = asm["__GLOBAL__sub_I_Observable_cpp"];
var _GlGraphRenderingParameters_setMaxSizeOfLabels = Module["_GlGraphRenderingParameters_setMaxSizeOfLabels"] = asm["_GlGraphRenderingParameters_setMaxSizeOfLabels"];
var __GLOBAL__sub_I_GraphProperty_cpp = Module["__GLOBAL__sub_I_GraphProperty_cpp"] = asm["__GLOBAL__sub_I_GraphProperty_cpp"];
var _Graph_getLocalDoubleProperty = Module["_Graph_getLocalDoubleProperty"] = asm["_Graph_getLocalDoubleProperty"];
var _GlGraphRenderingParameters_elementsOrdered = Module["_GlGraphRenderingParameters_elementsOrdered"] = asm["_GlGraphRenderingParameters_elementsOrdered"];
var _BooleanProperty_getEdgesEqualTo = Module["_BooleanProperty_getEdgesEqualTo"] = asm["_BooleanProperty_getEdgesEqualTo"];
var _LayoutProperty_getEdgeValue = Module["_LayoutProperty_getEdgeValue"] = asm["_LayoutProperty_getEdgeValue"];
var _PropertyInterface_delete = Module["_PropertyInterface_delete"] = asm["_PropertyInterface_delete"];
var __GLOBAL__sub_I_IntegerProperty_cpp = Module["__GLOBAL__sub_I_IntegerProperty_cpp"] = asm["__GLOBAL__sub_I_IntegerProperty_cpp"];
var ___cxx_global_var_init_1 = Module["___cxx_global_var_init_1"] = asm["___cxx_global_var_init_1"];
var __GLOBAL__sub_I_OGDFKamadaKawai_cpp = Module["__GLOBAL__sub_I_OGDFKamadaKawai_cpp"] = asm["__GLOBAL__sub_I_OGDFKamadaKawai_cpp"];
var _IntegerProperty_getEdgeValue = Module["_IntegerProperty_getEdgeValue"] = asm["_IntegerProperty_getEdgeValue"];
var __GLOBAL__sub_I_SquarifiedTreeMap_cpp = Module["__GLOBAL__sub_I_SquarifiedTreeMap_cpp"] = asm["__GLOBAL__sub_I_SquarifiedTreeMap_cpp"];
var _StringProperty_getNodeDefaultValue = Module["_StringProperty_getNodeDefaultValue"] = asm["_StringProperty_getNodeDefaultValue"];
var _GlGraphInputData_setElementSrcAnchorSize = Module["_GlGraphInputData_setElementSrcAnchorSize"] = asm["_GlGraphInputData_setElementSrcAnchorSize"];
var _BooleanVectorProperty_getEdgeDefaultVectorSize = Module["_BooleanVectorProperty_getEdgeDefaultVectorSize"] = asm["_BooleanVectorProperty_getEdgeDefaultVectorSize"];
var _GlGraphInputData_getElementRotation = Module["_GlGraphInputData_getElementRotation"] = asm["_GlGraphInputData_getElementRotation"];
var _DoubleVectorProperty_getNodeValue = Module["_DoubleVectorProperty_getNodeValue"] = asm["_DoubleVectorProperty_getNodeValue"];
var _Graph_ends = Module["_Graph_ends"] = asm["_Graph_ends"];
var __GLOBAL__sub_I_TlpJsonImport_cpp = Module["__GLOBAL__sub_I_TlpJsonImport_cpp"] = asm["__GLOBAL__sub_I_TlpJsonImport_cpp"];
var _IntegerVectorProperty_getEdgeDefaultVectorSize = Module["_IntegerVectorProperty_getEdgeDefaultVectorSize"] = asm["_IntegerVectorProperty_getEdgeDefaultVectorSize"];
var __GLOBAL__sub_I_NeighborhoodInteractor_cpp = Module["__GLOBAL__sub_I_NeighborhoodInteractor_cpp"] = asm["__GLOBAL__sub_I_NeighborhoodInteractor_cpp"];
var _DoubleProperty_getSortedEdges = Module["_DoubleProperty_getSortedEdges"] = asm["_DoubleProperty_getSortedEdges"];
var __GLOBAL__sub_I_MCLClustering_cpp = Module["__GLOBAL__sub_I_MCLClustering_cpp"] = asm["__GLOBAL__sub_I_MCLClustering_cpp"];
var __GLOBAL__sub_I_Logger_cpp = Module["__GLOBAL__sub_I_Logger_cpp"] = asm["__GLOBAL__sub_I_Logger_cpp"];
var _StringVectorProperty_getNodeStringsLengths = Module["_StringVectorProperty_getNodeStringsLengths"] = asm["_StringVectorProperty_getNodeStringsLengths"];
var __GLOBAL__sub_I_SelectionInteractor_cpp = Module["__GLOBAL__sub_I_SelectionInteractor_cpp"] = asm["__GLOBAL__sub_I_SelectionInteractor_cpp"];
var _GlGraphRenderingParameters_setLabelsScaled = Module["_GlGraphRenderingParameters_setLabelsScaled"] = asm["_GlGraphRenderingParameters_setLabelsScaled"];
var _Graph_push = Module["_Graph_push"] = asm["_Graph_push"];
var __GLOBAL__sub_I_GraphView_cpp = Module["__GLOBAL__sub_I_GraphView_cpp"] = asm["__GLOBAL__sub_I_GraphView_cpp"];
var _GlGraphInputData_setElementTexture = Module["_GlGraphInputData_setElementTexture"] = asm["_GlGraphInputData_setElementTexture"];
var _pthread_mutex_lock = Module["_pthread_mutex_lock"] = asm["_pthread_mutex_lock"];
var __GLOBAL__sub_I_BendsTools_cpp = Module["__GLOBAL__sub_I_BendsTools_cpp"] = asm["__GLOBAL__sub_I_BendsTools_cpp"];
var __GLOBAL__sub_I_Grid_cpp = Module["__GLOBAL__sub_I_Grid_cpp"] = asm["__GLOBAL__sub_I_Grid_cpp"];
var __GLOBAL__sub_I_OsiNames_cpp = Module["__GLOBAL__sub_I_OsiNames_cpp"] = asm["__GLOBAL__sub_I_OsiNames_cpp"];
var _GlGraphInputData_setElementSize = Module["_GlGraphInputData_setElementSize"] = asm["_GlGraphInputData_setElementSize"];
var __GLOBAL__sub_I_CoinParamUtils_cpp = Module["__GLOBAL__sub_I_CoinParamUtils_cpp"] = asm["__GLOBAL__sub_I_CoinParamUtils_cpp"];
var _LayoutProperty_center2 = Module["_LayoutProperty_center2"] = asm["_LayoutProperty_center2"];
var __GLOBAL__sub_I_GlQuadTreeLODCalculator_cpp = Module["__GLOBAL__sub_I_GlQuadTreeLODCalculator_cpp"] = asm["__GLOBAL__sub_I_GlQuadTreeLODCalculator_cpp"];
var _GlGraphInputData_setElementFont = Module["_GlGraphInputData_setElementFont"] = asm["_GlGraphInputData_setElementFont"];
var _GlGraphInputData_getElementFont = Module["_GlGraphInputData_getElementFont"] = asm["_GlGraphInputData_getElementFont"];
var _GlGraphInputData_getElementLayout = Module["_GlGraphInputData_getElementLayout"] = asm["_GlGraphInputData_getElementLayout"];
var ___cxx_global_var_init_8 = Module["___cxx_global_var_init_8"] = asm["___cxx_global_var_init_8"];
var _LayoutProperty_translate = Module["_LayoutProperty_translate"] = asm["_LayoutProperty_translate"];
var ___cxx_global_var_init_11_332 = Module["___cxx_global_var_init_11_332"] = asm["___cxx_global_var_init_11_332"];
var _IntegerVectorProperty_setEdgeValue = Module["_IntegerVectorProperty_setEdgeValue"] = asm["_IntegerVectorProperty_setEdgeValue"];
var _Graph_getSizeVectorProperty = Module["_Graph_getSizeVectorProperty"] = asm["_Graph_getSizeVectorProperty"];
var _Graph_getSource = Module["_Graph_getSource"] = asm["_Graph_getSource"];
var _sizeAlgorithmsNamesLengths = Module["_sizeAlgorithmsNamesLengths"] = asm["_sizeAlgorithmsNamesLengths"];
var _Graph_getRoot = Module["_Graph_getRoot"] = asm["_Graph_getRoot"];
var __GLOBAL__sub_I_LinLogAlgorithm_cpp = Module["__GLOBAL__sub_I_LinLogAlgorithm_cpp"] = asm["__GLOBAL__sub_I_LinLogAlgorithm_cpp"];
var ___cxx_global_var_init = Module["___cxx_global_var_init"] = asm["___cxx_global_var_init"];
var _Graph_bfs = Module["_Graph_bfs"] = asm["_Graph_bfs"];
var __GLOBAL__sub_I_OGDFBertaultLayout_cpp = Module["__GLOBAL__sub_I_OGDFBertaultLayout_cpp"] = asm["__GLOBAL__sub_I_OGDFBertaultLayout_cpp"];
var _computeGraphHullVertices = Module["_computeGraphHullVertices"] = asm["_computeGraphHullVertices"];
var __GLOBAL__sub_I_RandomTree_cpp = Module["__GLOBAL__sub_I_RandomTree_cpp"] = asm["__GLOBAL__sub_I_RandomTree_cpp"];
var _Graph_openMetaNode = Module["_Graph_openMetaNode"] = asm["_Graph_openMetaNode"];
var _ColorProperty_getNodeDefaultValue = Module["_ColorProperty_getNodeDefaultValue"] = asm["_ColorProperty_getNodeDefaultValue"];
var _initCanvas = Module["_initCanvas"] = asm["_initCanvas"];
var _getImportPluginsList = Module["_getImportPluginsList"] = asm["_getImportPluginsList"];
var _GlGraphRenderingParameters_setInterpolateEdgesSizes = Module["_GlGraphRenderingParameters_setInterpolateEdgesSizes"] = asm["_GlGraphRenderingParameters_setInterpolateEdgesSizes"];
var _ColorProperty_setEdgeValue = Module["_ColorProperty_setEdgeValue"] = asm["_ColorProperty_setEdgeValue"];
var _GlGraphRenderingParameters_displayEdges = Module["_GlGraphRenderingParameters_displayEdges"] = asm["_GlGraphRenderingParameters_displayEdges"];
var _doubleAlgorithmsNamesLengths = Module["_doubleAlgorithmsNamesLengths"] = asm["_doubleAlgorithmsNamesLengths"];
var _sbrk = Module["_sbrk"] = asm["_sbrk"];
var _Graph_getLocalIntegerVectorProperty = Module["_Graph_getLocalIntegerVectorProperty"] = asm["_Graph_getLocalIntegerVectorProperty"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var __GLOBAL__sub_I_Simple_cpp = Module["__GLOBAL__sub_I_Simple_cpp"] = asm["__GLOBAL__sub_I_Simple_cpp"];
var _GlGraphInputData_getElementSelection = Module["_GlGraphInputData_getElementSelection"] = asm["_GlGraphInputData_getElementSelection"];
var _IntegerVectorProperty_getEdgeValue = Module["_IntegerVectorProperty_getEdgeValue"] = asm["_IntegerVectorProperty_getEdgeValue"];
var ___cxx_global_var_init_1380 = Module["___cxx_global_var_init_1380"] = asm["___cxx_global_var_init_1380"];
var ___cxx_global_var_init_5_329 = Module["___cxx_global_var_init_5_329"] = asm["___cxx_global_var_init_5_329"];
var __GLOBAL__sub_I_OrientableSizeProxy_cpp = Module["__GLOBAL__sub_I_OrientableSizeProxy_cpp"] = asm["__GLOBAL__sub_I_OrientableSizeProxy_cpp"];
var _StringVectorProperty_setAllEdgeValue = Module["_StringVectorProperty_setAllEdgeValue"] = asm["_StringVectorProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_OGDFMMMExampleFastLayout_cpp = Module["__GLOBAL__sub_I_OGDFMMMExampleFastLayout_cpp"] = asm["__GLOBAL__sub_I_OGDFMMMExampleFastLayout_cpp"];
var __GLOBAL__sub_I_GlScene_cpp = Module["__GLOBAL__sub_I_GlScene_cpp"] = asm["__GLOBAL__sub_I_GlScene_cpp"];
var __GLOBAL__sub_I_OGDFPivotMDS_cpp = Module["__GLOBAL__sub_I_OGDFPivotMDS_cpp"] = asm["__GLOBAL__sub_I_OGDFPivotMDS_cpp"];
var _IntegerProperty_getNodeDefaultValue = Module["_IntegerProperty_getNodeDefaultValue"] = asm["_IntegerProperty_getNodeDefaultValue"];
var __GLOBAL__sub_I_SpanningDagSelection_cpp = Module["__GLOBAL__sub_I_SpanningDagSelection_cpp"] = asm["__GLOBAL__sub_I_SpanningDagSelection_cpp"];
var _Graph_getProperties = Module["_Graph_getProperties"] = asm["_Graph_getProperties"];
var _Graph_delNodes = Module["_Graph_delNodes"] = asm["_Graph_delNodes"];
var _getLayoutAlgorithmPluginsList = Module["_getLayoutAlgorithmPluginsList"] = asm["_getLayoutAlgorithmPluginsList"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];
var _LayoutProperty_center = Module["_LayoutProperty_center"] = asm["_LayoutProperty_center"];
var _IntegerVectorProperty_getNodeVectorSize = Module["_IntegerVectorProperty_getNodeVectorSize"] = asm["_IntegerVectorProperty_getNodeVectorSize"];
var _GlGraphRenderingParameters_setElementsOrderingProperty = Module["_GlGraphRenderingParameters_setElementsOrderingProperty"] = asm["_GlGraphRenderingParameters_setElementsOrderingProperty"];
var _ColorScale_getColors = Module["_ColorScale_getColors"] = asm["_ColorScale_getColors"];
var __GLOBAL__sub_I_WelshPowell_cpp = Module["__GLOBAL__sub_I_WelshPowell_cpp"] = asm["__GLOBAL__sub_I_WelshPowell_cpp"];
var _IntegerProperty_setAllNodeValue = Module["_IntegerProperty_setAllNodeValue"] = asm["_IntegerProperty_setAllNodeValue"];
var __GLOBAL__sub_I_LabelsRenderer_cpp = Module["__GLOBAL__sub_I_LabelsRenderer_cpp"] = asm["__GLOBAL__sub_I_LabelsRenderer_cpp"];
var __GLOBAL__sub_I_ConnectedComponent_cpp = Module["__GLOBAL__sub_I_ConnectedComponent_cpp"] = asm["__GLOBAL__sub_I_ConnectedComponent_cpp"];
var _randomDouble = Module["_randomDouble"] = asm["_randomDouble"];
var _GlGraphRenderingParameters_edges3D = Module["_GlGraphRenderingParameters_edges3D"] = asm["_GlGraphRenderingParameters_edges3D"];
var _DoubleVectorProperty_getNodeDefaultValue = Module["_DoubleVectorProperty_getNodeDefaultValue"] = asm["_DoubleVectorProperty_getNodeDefaultValue"];
var _Graph_setEdgeOrder = Module["_Graph_setEdgeOrder"] = asm["_Graph_setEdgeOrder"];
var __GLOBAL__sub_I_GraphMeasure_cpp = Module["__GLOBAL__sub_I_GraphMeasure_cpp"] = asm["__GLOBAL__sub_I_GraphMeasure_cpp"];
var _Graph_getDoubleProperty = Module["_Graph_getDoubleProperty"] = asm["_Graph_getDoubleProperty"];
var _Graph_getLocalColorVectorProperty = Module["_Graph_getLocalColorVectorProperty"] = asm["_Graph_getLocalColorVectorProperty"];
var __GLOBAL__sub_I_AutoSize_cpp = Module["__GLOBAL__sub_I_AutoSize_cpp"] = asm["__GLOBAL__sub_I_AutoSize_cpp"];
var _SizeProperty_setAllNodeValue = Module["_SizeProperty_setAllNodeValue"] = asm["_SizeProperty_setAllNodeValue"];
var _Graph_getSizeProperty = Module["_Graph_getSizeProperty"] = asm["_Graph_getSizeProperty"];
var _StringVectorProperty_getEdgeDefaultVectorSize = Module["_StringVectorProperty_getEdgeDefaultVectorSize"] = asm["_StringVectorProperty_getEdgeDefaultVectorSize"];
var __GLOBAL__sub_I_DoubleProperty_cpp = Module["__GLOBAL__sub_I_DoubleProperty_cpp"] = asm["__GLOBAL__sub_I_DoubleProperty_cpp"];
var _holdObservers = Module["_holdObservers"] = asm["_holdObservers"];
var _draw = Module["_draw"] = asm["_draw"];
var _GlGraphInputData_getElementGlow = Module["_GlGraphInputData_getElementGlow"] = asm["_GlGraphInputData_getElementGlow"];
var _BooleanProperty_getNodeValue = Module["_BooleanProperty_getNodeValue"] = asm["_BooleanProperty_getNodeValue"];
var ___cxx_global_var_init_31 = Module["___cxx_global_var_init_31"] = asm["___cxx_global_var_init_31"];
var ___cxx_global_var_init_33 = Module["___cxx_global_var_init_33"] = asm["___cxx_global_var_init_33"];
var _ColorVectorProperty_setEdgeValue = Module["_ColorVectorProperty_setEdgeValue"] = asm["_ColorVectorProperty_setEdgeValue"];
var _GlGraphInputData_getElementTgtAnchorShape = Module["_GlGraphInputData_getElementTgtAnchorShape"] = asm["_GlGraphInputData_getElementTgtAnchorShape"];
var _fullScreen = Module["_fullScreen"] = asm["_fullScreen"];
var __GLOBAL__sub_I_AdjacencyMatrixImport_cpp = Module["__GLOBAL__sub_I_AdjacencyMatrixImport_cpp"] = asm["__GLOBAL__sub_I_AdjacencyMatrixImport_cpp"];
var _llvm_bswap_i32 = Module["_llvm_bswap_i32"] = asm["_llvm_bswap_i32"];
var _ColorVectorProperty_getEdgeDefaultVectorSize = Module["_ColorVectorProperty_getEdgeDefaultVectorSize"] = asm["_ColorVectorProperty_getEdgeDefaultVectorSize"];
var _GlGraphInputData_getElementBorderWidth = Module["_GlGraphInputData_getElementBorderWidth"] = asm["_GlGraphInputData_getElementBorderWidth"];
var __GLOBAL__sub_I_BetweennessCentrality_cpp = Module["__GLOBAL__sub_I_BetweennessCentrality_cpp"] = asm["__GLOBAL__sub_I_BetweennessCentrality_cpp"];
var _Graph_delete = Module["_Graph_delete"] = asm["_Graph_delete"];
var _LayoutProperty_getMax = Module["_LayoutProperty_getMax"] = asm["_LayoutProperty_getMax"];
var __GLOBAL__sub_I_RoundedBoxGlyph_cpp = Module["__GLOBAL__sub_I_RoundedBoxGlyph_cpp"] = asm["__GLOBAL__sub_I_RoundedBoxGlyph_cpp"];
var _DoubleVectorProperty_getEdgeDefaultVectorSize = Module["_DoubleVectorProperty_getEdgeDefaultVectorSize"] = asm["_DoubleVectorProperty_getEdgeDefaultVectorSize"];
var __Z7my_loadv = Module["__Z7my_loadv"] = asm["__Z7my_loadv"];
var __GLOBAL__sub_I_Distances_cpp = Module["__GLOBAL__sub_I_Distances_cpp"] = asm["__GLOBAL__sub_I_Distances_cpp"];
var _DoubleProperty_setEdgeValue = Module["_DoubleProperty_setEdgeValue"] = asm["_DoubleProperty_setEdgeValue"];
var _setViewBackgroundColor = Module["_setViewBackgroundColor"] = asm["_setViewBackgroundColor"];
var _PropertyInterface_copy = Module["_PropertyInterface_copy"] = asm["_PropertyInterface_copy"];
var _GlGraphInputData_getElementSize = Module["_GlGraphInputData_getElementSize"] = asm["_GlGraphInputData_getElementSize"];
var _StringProperty_getEdgeValue = Module["_StringProperty_getEdgeValue"] = asm["_StringProperty_getEdgeValue"];
var _GlGraphInputData_setElementShape = Module["_GlGraphInputData_setElementShape"] = asm["_GlGraphInputData_setElementShape"];
var _Graph_numberOfNodes = Module["_Graph_numberOfNodes"] = asm["_Graph_numberOfNodes"];
var __GLOBAL__sub_I_GlTextureManager_cpp = Module["__GLOBAL__sub_I_GlTextureManager_cpp"] = asm["__GLOBAL__sub_I_GlTextureManager_cpp"];
var __GLOBAL__sub_I_CubeGlyph_cpp = Module["__GLOBAL__sub_I_CubeGlyph_cpp"] = asm["__GLOBAL__sub_I_CubeGlyph_cpp"];
var _IntegerVectorProperty_getNodeDefaultVectorSize = Module["_IntegerVectorProperty_getNodeDefaultVectorSize"] = asm["_IntegerVectorProperty_getNodeDefaultVectorSize"];
var __GLOBAL__sub_I_DatasetTools_cpp = Module["__GLOBAL__sub_I_DatasetTools_cpp"] = asm["__GLOBAL__sub_I_DatasetTools_cpp"];
var ___cxx_global_var_init_11 = Module["___cxx_global_var_init_11"] = asm["___cxx_global_var_init_11"];
var _Graph_reverse = Module["_Graph_reverse"] = asm["_Graph_reverse"];
var _Graph_getLocalColorProperty = Module["_Graph_getLocalColorProperty"] = asm["_Graph_getLocalColorProperty"];
var _Graph_target = Module["_Graph_target"] = asm["_Graph_target"];
var _Graph_getNodes = Module["_Graph_getNodes"] = asm["_Graph_getNodes"];
var _GlGraphInputData_setElementColor = Module["_GlGraphInputData_setElementColor"] = asm["_GlGraphInputData_setElementColor"];
var _Graph_getInEdges = Module["_Graph_getInEdges"] = asm["_Graph_getInEdges"];
var _memset = Module["_memset"] = asm["_memset"];
var _ColorProperty_getEdgeValue = Module["_ColorProperty_getEdgeValue"] = asm["_ColorProperty_getEdgeValue"];
var __GLOBAL__sub_I_OGDFMMMExampleNiceLayout_cpp = Module["__GLOBAL__sub_I_OGDFMMMExampleNiceLayout_cpp"] = asm["__GLOBAL__sub_I_OGDFMMMExampleNiceLayout_cpp"];
var _Graph_getRandomNode = Module["_Graph_getRandomNode"] = asm["_Graph_getRandomNode"];
var _GlGraphRenderingParameters_displayEdgesExtremities = Module["_GlGraphRenderingParameters_displayEdgesExtremities"] = asm["_GlGraphRenderingParameters_displayEdgesExtremities"];
var _SizeProperty_setEdgeValue = Module["_SizeProperty_setEdgeValue"] = asm["_SizeProperty_setEdgeValue"];
var _setGraphRenderingDataReady = Module["_setGraphRenderingDataReady"] = asm["_setGraphRenderingDataReady"];
var _StringVectorProperty_getEdgeValue = Module["_StringVectorProperty_getEdgeValue"] = asm["_StringVectorProperty_getEdgeValue"];
var _randomInteger = Module["_randomInteger"] = asm["_randomInteger"];
var _getDoubleAlgorithmPluginsList = Module["_getDoubleAlgorithmPluginsList"] = asm["_getDoubleAlgorithmPluginsList"];
var __GLOBAL__sub_I_DrawingTools_cpp = Module["__GLOBAL__sub_I_DrawingTools_cpp"] = asm["__GLOBAL__sub_I_DrawingTools_cpp"];
var _LayoutProperty_setAllNodeValue = Module["_LayoutProperty_setAllNodeValue"] = asm["_LayoutProperty_setAllNodeValue"];
var _pthread_cond_broadcast = Module["_pthread_cond_broadcast"] = asm["_pthread_cond_broadcast"];
var _main = Module["_main"] = asm["_main"];
var _Graph_isEdgeElement = Module["_Graph_isEdgeElement"] = asm["_Graph_isEdgeElement"];
var _PropertyInterface_getNodeStringValue = Module["_PropertyInterface_getNodeStringValue"] = asm["_PropertyInterface_getNodeStringValue"];
var _BooleanVectorProperty_getNodeVectorSize = Module["_BooleanVectorProperty_getNodeVectorSize"] = asm["_BooleanVectorProperty_getNodeVectorSize"];
var _GlGraphInputData_setElementLayout = Module["_GlGraphInputData_setElementLayout"] = asm["_GlGraphInputData_setElementLayout"];
var _Graph_addEdges1 = Module["_Graph_addEdges1"] = asm["_Graph_addEdges1"];
var __GLOBAL__sub_I_StringProperty_cpp = Module["__GLOBAL__sub_I_StringProperty_cpp"] = asm["__GLOBAL__sub_I_StringProperty_cpp"];
var _Graph_addNode1 = Module["_Graph_addNode1"] = asm["_Graph_addNode1"];
var _Graph_getRandomEdge = Module["_Graph_getRandomEdge"] = asm["_Graph_getRandomEdge"];
var _algorithmsNamesLengths = Module["_algorithmsNamesLengths"] = asm["_algorithmsNamesLengths"];
var _Graph_isNodeElement = Module["_Graph_isNodeElement"] = asm["_Graph_isNodeElement"];
var _Graph_getBooleanProperty = Module["_Graph_getBooleanProperty"] = asm["_Graph_getBooleanProperty"];
var _createBooleanVectorProperty = Module["_createBooleanVectorProperty"] = asm["_createBooleanVectorProperty"];
var __GLOBAL__sub_I_LeafMetric_cpp = Module["__GLOBAL__sub_I_LeafMetric_cpp"] = asm["__GLOBAL__sub_I_LeafMetric_cpp"];
var __GLOBAL__sub_I_VoronoiDiagram_cpp = Module["__GLOBAL__sub_I_VoronoiDiagram_cpp"] = asm["__GLOBAL__sub_I_VoronoiDiagram_cpp"];
var __GLOBAL__sub_I_OGDFUpwardPlanarization_cpp = Module["__GLOBAL__sub_I_OGDFUpwardPlanarization_cpp"] = asm["__GLOBAL__sub_I_OGDFUpwardPlanarization_cpp"];
var _Graph_setSource = Module["_Graph_setSource"] = asm["_Graph_setSource"];
var _SizeProperty_getEdgeValue = Module["_SizeProperty_getEdgeValue"] = asm["_SizeProperty_getEdgeValue"];
var __GLOBAL__sub_I_GlGraph_cpp = Module["__GLOBAL__sub_I_GlGraph_cpp"] = asm["__GLOBAL__sub_I_GlGraph_cpp"];
var __GLOBAL__sub_I_OctreeBundle_cpp = Module["__GLOBAL__sub_I_OctreeBundle_cpp"] = asm["__GLOBAL__sub_I_OctreeBundle_cpp"];
var _Graph_getSubGraph1 = Module["_Graph_getSubGraph1"] = asm["_Graph_getSubGraph1"];
var _Graph_getSubGraph2 = Module["_Graph_getSubGraph2"] = asm["_Graph_getSubGraph2"];
var __GLOBAL__sub_I_OGDFVisibility_cpp = Module["__GLOBAL__sub_I_OGDFVisibility_cpp"] = asm["__GLOBAL__sub_I_OGDFVisibility_cpp"];
var __GLOBAL__sub_I_PerfectLayout_cpp = Module["__GLOBAL__sub_I_PerfectLayout_cpp"] = asm["__GLOBAL__sub_I_PerfectLayout_cpp"];
var __GLOBAL__sub_I_MISFiltering_cpp = Module["__GLOBAL__sub_I_MISFiltering_cpp"] = asm["__GLOBAL__sub_I_MISFiltering_cpp"];
var _Graph_getLocalStringProperty = Module["_Graph_getLocalStringProperty"] = asm["_Graph_getLocalStringProperty"];
var _StringVectorProperty_getEdgeDefaultStringsLengths = Module["_StringVectorProperty_getEdgeDefaultStringsLengths"] = asm["_StringVectorProperty_getEdgeDefaultStringsLengths"];
var _SizeProperty_scale = Module["_SizeProperty_scale"] = asm["_SizeProperty_scale"];
var __GLOBAL__sub_I_PlanarGraph_cpp = Module["__GLOBAL__sub_I_PlanarGraph_cpp"] = asm["__GLOBAL__sub_I_PlanarGraph_cpp"];
var __GLOBAL__sub_I_OGDFPlanarizationGrid_cpp = Module["__GLOBAL__sub_I_OGDFPlanarizationGrid_cpp"] = asm["__GLOBAL__sub_I_OGDFPlanarizationGrid_cpp"];
var __GLOBAL__sub_I_Outerplanar_cpp = Module["__GLOBAL__sub_I_Outerplanar_cpp"] = asm["__GLOBAL__sub_I_Outerplanar_cpp"];
var _StringVectorProperty_getEdgeVectorSize = Module["_StringVectorProperty_getEdgeVectorSize"] = asm["_StringVectorProperty_getEdgeVectorSize"];
var _selectNodes = Module["_selectNodes"] = asm["_selectNodes"];
var __GLOBAL__sub_I_PathLengthMetric_cpp = Module["__GLOBAL__sub_I_PathLengthMetric_cpp"] = asm["__GLOBAL__sub_I_PathLengthMetric_cpp"];
var __GLOBAL__sub_I_GMLImport_cpp = Module["__GLOBAL__sub_I_GMLImport_cpp"] = asm["__GLOBAL__sub_I_GMLImport_cpp"];
var _GlGraphInputData_setElementFontSize = Module["_GlGraphInputData_setElementFontSize"] = asm["_GlGraphInputData_setElementFontSize"];
var _BooleanProperty_getEdgeValue = Module["_BooleanProperty_getEdgeValue"] = asm["_BooleanProperty_getEdgeValue"];
var _Graph_getInOutEdges = Module["_Graph_getInOutEdges"] = asm["_Graph_getInOutEdges"];
var _GlGraphRenderingParameters_interpolateEdgesSizes = Module["_GlGraphRenderingParameters_interpolateEdgesSizes"] = asm["_GlGraphRenderingParameters_interpolateEdgesSizes"];
var _LayoutProperty_setAllEdgeValue = Module["_LayoutProperty_setAllEdgeValue"] = asm["_LayoutProperty_setAllEdgeValue"];
var __GLOBAL__sub_I_Planarity_cpp = Module["__GLOBAL__sub_I_Planarity_cpp"] = asm["__GLOBAL__sub_I_Planarity_cpp"];
var __GLOBAL__sub_I_OGDFMMMExampleNoTwistLayout_cpp = Module["__GLOBAL__sub_I_OGDFMMMExampleNoTwistLayout_cpp"] = asm["__GLOBAL__sub_I_OGDFMMMExampleNoTwistLayout_cpp"];
var _StringProperty_setAllNodeValue = Module["_StringProperty_setAllNodeValue"] = asm["_StringProperty_setAllNodeValue"];
var __GLOBAL__sub_I_SphereUtils_cpp = Module["__GLOBAL__sub_I_SphereUtils_cpp"] = asm["__GLOBAL__sub_I_SphereUtils_cpp"];
var _getSelectedNodes = Module["_getSelectedNodes"] = asm["_getSelectedNodes"];
var __GLOBAL__sub_I_WithParameter_cpp = Module["__GLOBAL__sub_I_WithParameter_cpp"] = asm["__GLOBAL__sub_I_WithParameter_cpp"];
var __GLOBAL__sub_I_unitTest_cpp = Module["__GLOBAL__sub_I_unitTest_cpp"] = asm["__GLOBAL__sub_I_unitTest_cpp"];
var __GLOBAL__sub_I_StarGlyph_cpp = Module["__GLOBAL__sub_I_StarGlyph_cpp"] = asm["__GLOBAL__sub_I_StarGlyph_cpp"];
var _LayoutProperty_rotateY = Module["_LayoutProperty_rotateY"] = asm["_LayoutProperty_rotateY"];
var __GLOBAL__sub_I_BubbleTree_cpp = Module["__GLOBAL__sub_I_BubbleTree_cpp"] = asm["__GLOBAL__sub_I_BubbleTree_cpp"];
var _Graph_getSubGraphs = Module["_Graph_getSubGraphs"] = asm["_Graph_getSubGraphs"];
var _realloc = Module["_realloc"] = asm["_realloc"];
var __GLOBAL__sub_I_TLPExport_cpp = Module["__GLOBAL__sub_I_TLPExport_cpp"] = asm["__GLOBAL__sub_I_TLPExport_cpp"];
var _getSizeAlgorithmPluginsList = Module["_getSizeAlgorithmPluginsList"] = asm["_getSizeAlgorithmPluginsList"];
var ___getTypeName = Module["___getTypeName"] = asm["___getTypeName"];
var _booleanAlgorithmExists = Module["_booleanAlgorithmExists"] = asm["_booleanAlgorithmExists"];
var _Graph_addNode2 = Module["_Graph_addNode2"] = asm["_Graph_addNode2"];
var _DoubleVectorProperty_setAllNodeValue = Module["_DoubleVectorProperty_setAllNodeValue"] = asm["_DoubleVectorProperty_setAllNodeValue"];
var __GLOBAL__sub_I_SpanningTreeSelection_cpp = Module["__GLOBAL__sub_I_SpanningTreeSelection_cpp"] = asm["__GLOBAL__sub_I_SpanningTreeSelection_cpp"];
var _resizeCanvas = Module["_resizeCanvas"] = asm["_resizeCanvas"];
var _isPointerDeleted = Module["_isPointerDeleted"] = asm["_isPointerDeleted"];
var _colorAlgorithmsNamesLengths = Module["_colorAlgorithmsNamesLengths"] = asm["_colorAlgorithmsNamesLengths"];
var _numberOfPlugins = Module["_numberOfPlugins"] = asm["_numberOfPlugins"];
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = asm["dynCall_iiiiiiii"];
var dynCall_iiiiiid = Module["dynCall_iiiiiid"] = asm["dynCall_iiiiiid"];
var dynCall_iiiddi = Module["dynCall_iiiddi"] = asm["dynCall_iiiddi"];
var dynCall_vif = Module["dynCall_vif"] = asm["dynCall_vif"];
var dynCall_vid = Module["dynCall_vid"] = asm["dynCall_vid"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vij = Module["dynCall_vij"] = asm["dynCall_vij"];
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = asm["dynCall_iiiiiiiiii"];
var dynCall_iiidd = Module["dynCall_iiidd"] = asm["dynCall_iiidd"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = asm["dynCall_iiiiiii"];
var dynCall_iiiiiiid = Module["dynCall_iiiiiiid"] = asm["dynCall_iiiiiiid"];
var dynCall_viijii = Module["dynCall_viijii"] = asm["dynCall_viijii"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_viidddi = Module["dynCall_viidddi"] = asm["dynCall_viidddi"];
var dynCall_viidiii = Module["dynCall_viidiii"] = asm["dynCall_viidiii"];
var dynCall_viidd = Module["dynCall_viidd"] = asm["dynCall_viidd"];
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = asm["dynCall_viiiiiiiii"];
var dynCall_viidi = Module["dynCall_viidi"] = asm["dynCall_viidi"];
var dynCall_fff = Module["dynCall_fff"] = asm["dynCall_fff"];
var dynCall_iidi = Module["dynCall_iidi"] = asm["dynCall_iidi"];
var dynCall_viiidd = Module["dynCall_viiidd"] = asm["dynCall_viiidd"];
var dynCall_vidii = Module["dynCall_vidii"] = asm["dynCall_vidii"];
var dynCall_iiiidid = Module["dynCall_iiiidid"] = asm["dynCall_iiiidid"];
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
var dynCall_vidiiiii = Module["dynCall_vidiiiii"] = asm["dynCall_vidiiiii"];
var dynCall_vidiiii = Module["dynCall_vidiiii"] = asm["dynCall_vidiiii"];
var dynCall_viiddii = Module["dynCall_viiddii"] = asm["dynCall_viiddii"];
var dynCall_viiidiidi = Module["dynCall_viiidiidi"] = asm["dynCall_viiidiidi"];
var dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] = asm["dynCall_viiiiiiiiiiii"];
var dynCall_diiiii = Module["dynCall_diiiii"] = asm["dynCall_diiiii"];
var dynCall_viiiiiiiiiii = Module["dynCall_viiiiiiiiiii"] = asm["dynCall_viiiiiiiiiii"];
var dynCall_viiid = Module["dynCall_viiid"] = asm["dynCall_viiid"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viiiiiddiid = Module["dynCall_viiiiiddiid"] = asm["dynCall_viiiiiddiid"];
var dynCall_viiiiddd = Module["dynCall_viiiiddd"] = asm["dynCall_viiiiddd"];
var dynCall_viifff = Module["dynCall_viifff"] = asm["dynCall_viifff"];
var dynCall_viiiiid = Module["dynCall_viiiiid"] = asm["dynCall_viiiiid"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_vifi = Module["dynCall_vifi"] = asm["dynCall_vifi"];
var dynCall_iij = Module["dynCall_iij"] = asm["dynCall_iij"];
var dynCall_diiii = Module["dynCall_diiii"] = asm["dynCall_diiii"];
var dynCall_viid = Module["dynCall_viid"] = asm["dynCall_viid"];
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = asm["dynCall_viiiiiii"];
var dynCall_di = Module["dynCall_di"] = asm["dynCall_di"];
var dynCall_viiidi = Module["dynCall_viiidi"] = asm["dynCall_viiidi"];
var dynCall_viiiid = Module["dynCall_viiiid"] = asm["dynCall_viiiid"];
var dynCall_diiiidiii = Module["dynCall_diiiidiii"] = asm["dynCall_diiiidiii"];
var dynCall_viiiidd = Module["dynCall_viiiidd"] = asm["dynCall_viiiidd"];
var dynCall_iiidiiii = Module["dynCall_iiidiiii"] = asm["dynCall_iiidiiii"];
var dynCall_iid = Module["dynCall_iid"] = asm["dynCall_iid"];
var dynCall_viiddd = Module["dynCall_viiddd"] = asm["dynCall_viiddd"];
var dynCall_dd = Module["dynCall_dd"] = asm["dynCall_dd"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_ff = Module["dynCall_ff"] = asm["dynCall_ff"];
var dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] = asm["dynCall_iiiiiiiiiiii"];
var dynCall_fi = Module["dynCall_fi"] = asm["dynCall_fi"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_diii = Module["dynCall_diii"] = asm["dynCall_diii"];
var dynCall_viidiidi = Module["dynCall_viidiidi"] = asm["dynCall_viidiidi"];
var dynCall_dii = Module["dynCall_dii"] = asm["dynCall_dii"];
var dynCall_viiifiii = Module["dynCall_viiifiii"] = asm["dynCall_viiifiii"];
var dynCall_viiiiiiddiid = Module["dynCall_viiiiiiddiid"] = asm["dynCall_viiiiiiddiid"];
var dynCall_viiiffii = Module["dynCall_viiiffii"] = asm["dynCall_viiiffii"];
var dynCall_viiiddi = Module["dynCall_viiiddi"] = asm["dynCall_viiiddi"];
var dynCall_iiid = Module["dynCall_iiid"] = asm["dynCall_iiid"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_viiddi = Module["dynCall_viiddi"] = asm["dynCall_viiddi"];
var dynCall_iiiiij = Module["dynCall_iiiiij"] = asm["dynCall_iiiiij"];
var dynCall_viii = Module["dynCall_viii"] = asm["dynCall_viii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = asm["dynCall_iiiiiiiii"];
var dynCall_viif = Module["dynCall_viif"] = asm["dynCall_viif"];
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = asm["dynCall_viiiiiiii"];
var dynCall_iiiiid = Module["dynCall_iiiiid"] = asm["dynCall_iiiiid"];
var dynCall_viiiidddi = Module["dynCall_viiiidddi"] = asm["dynCall_viiiidddi"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
;

Runtime.stackAlloc = asm['stackAlloc'];
Runtime.stackSave = asm['stackSave'];
Runtime.stackRestore = asm['stackRestore'];
Runtime.establishStackSpace = asm['establishStackSpace'];

Runtime.setTempRet0 = asm['setTempRet0'];
Runtime.getTempRet0 = asm['getTempRet0'];



// === Auto-generated postamble setup entry stuff ===



if (memoryInitializer) {
  if (typeof Module['locateFile'] === 'function') {
    memoryInitializer = Module['locateFile'](memoryInitializer);
  } else if (Module['memoryInitializerPrefixURL']) {
    memoryInitializer = Module['memoryInitializerPrefixURL'] + memoryInitializer;
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, Runtime.GLOBAL_BASE);
  } else {
    addRunDependency('memory initializer');
    var applyMemoryInitializer = function(data) {
      if (data.byteLength) data = new Uint8Array(data);
      HEAPU8.set(data, Runtime.GLOBAL_BASE);
      // Delete the typed array that contains the large blob of the memory initializer request response so that
      // we won't keep unnecessary memory lying around. However, keep the XHR object itself alive so that e.g.
      // its .status field can still be accessed later.
      if (Module['memoryInitializerRequest']) delete Module['memoryInitializerRequest'].response;
      removeRunDependency('memory initializer');
    }
    function doBrowserLoad() {
      Module['readAsync'](memoryInitializer, applyMemoryInitializer, function() {
        throw 'could not load memory initializer ' + memoryInitializer;
      });
    }
    if (Module['memoryInitializerRequest']) {
      // a network request has already been created, just use that
      function useRequest() {
        var request = Module['memoryInitializerRequest'];
        if (request.status !== 200 && request.status !== 0) {
          // If you see this warning, the issue may be that you are using locateFile or memoryInitializerPrefixURL, and defining them in JS. That
          // means that the HTML file doesn't know about them, and when it tries to create the mem init request early, does it to the wrong place.
          // Look in your browser's devtools network console to see what's going on.
          console.warn('a problem seems to have happened with Module.memoryInitializerRequest, status: ' + request.status + ', retrying ' + memoryInitializer);
          doBrowserLoad();
          return;
        }
        applyMemoryInitializer(request.response);
      }
      if (Module['memoryInitializerRequest'].response) {
        setTimeout(useRequest, 0); // it's already here; but, apply it asynchronously
      } else {
        Module['memoryInitializerRequest'].addEventListener('load', useRequest); // wait for it
      }
    } else {
      // fetch it from the network ourselves
      doBrowserLoad();
    }
  }
}


function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun']) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {

  args = args || [];

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString(Module['thisProgram']), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);


  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    exit(ret, /* implicit = */ true);
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    return;
  }


  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    if (ABORT) return;

    ensureInitRuntime();

    preMain();


    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    if (Module['_main'] && shouldRunNow) Module['callMain'](args);

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status, implicit) {
  if (implicit && Module['noExitRuntime']) {
    return;
  }

  if (Module['noExitRuntime']) {
  } else {

    ABORT = true;
    EXITSTATUS = status;
    STACKTOP = initialStackTop;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  if (ENVIRONMENT_IS_NODE) {
    process['exit'](status);
  } else if (ENVIRONMENT_IS_SHELL && typeof quit === 'function') {
    quit(status);
  }
  // if we reach here, we must throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

var abortDecorators = [];

function abort(what) {
  if (what !== undefined) {
    Module.print(what);
    Module.printErr(what);
    what = JSON.stringify(what)
  } else {
    what = '';
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.';

  var output = 'abort(' + what + ') at ' + stackTrace() + extra;
  if (abortDecorators) {
    abortDecorators.forEach(function(decorator) {
      output = decorator(output, what);
    });
  }
  throw output;
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}





// {{MODULE_ADDITIONS}}



/**
 *
 * This file is part of Tulip (www.tulip-software.org)
 *
 * Authors: David Auber and the Tulip development Team
 * from LaBRI, University of Bordeaux
 *
 * Tulip is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * Tulip is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 */

/**
 *
 * tulip.js : port of the Tulip framework to JavaScript through emscripten
 * Copyright (c) 2016 Antoine Lambert, Thales Services SAS
 * antoine-e.lambert@thalesgroup.com / antoine.lambert33@gmail.com
 *
 */

var tulip = Module;

var UINT_MAX = 0xffffffff;

function typeOf(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (Object.prototype.toString.call(value) == '[object Array]') {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}

function allocArrayInEmHeap(ArrayType, size) {
  var nDataBytes = size * ArrayType.BYTES_PER_ELEMENT;
  var dataPtr = Module._malloc(nDataBytes);
  return new ArrayType(Module.HEAPU8.buffer, dataPtr, size);
}

function freeArrayInEmHeap(arrayHeap) {
  Module._free(arrayHeap.byteOffset);
}

function bytesTypedArrayToStringArray(bytesArray, offsetArray, nbStrings) {
  var ret = [];
  var start = 0;
  for (var i = 0 ; i < nbStrings ; ++i) {
    ret.push(Module.UTF8ArrayToString(bytesArray.subarray(start, start+offsetArray[i]), 0));
    start += offsetArray[i];
  }
  return ret;
}

function stringArrayToBytesAndOffsetsTypedArray(stringArray) {
  var nbBytes = 0;
  var uintArray = allocArrayInEmHeap(Uint32Array, stringArray.length);
  for (var i = 0 ; i < stringArray.length ; ++i) {
    var strNbBytes = Module.lengthBytesUTF8(stringArray[i]) + 1;
    nbBytes += strNbBytes;
    uintArray[i] = strNbBytes;
  }
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  var offset = 0;
  for (var i = 0 ; i < stringArray.length ; ++i) {
    Module.stringToUTF8Array(stringArray[i], ucharArray, offset, uintArray[i]);
    offset += uintArray[i];
  }
  return {bytesArray: ucharArray, offsetsArray: uintArray};
}

Function.prototype.inheritsFrom = function(parentClassOrObject) {
  this.prototype = Object.create(parentClassOrObject.prototype);
  this.prototype.constructor = this;
};

if (typeOf(String.prototype.startsWith) == 'undefined') {

  String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
  };

  String.prototype.endsWith = function(suffix) {
    return this.match(suffix+'$') == suffix;
  };

}

function createObject(ObjectType, caller) {
  return ObjectType.prototype.isPrototypeOf(caller) ? caller : new ObjectType();
}

tulip.mainCalled = false;
if (nodejs) {
  tulip.mainCalled = true;
}

tulip.debugChecks = tulip.debugChecks || true;
if (workerMode) {
  tulip.debugChecks = false;
}

function checkArgumentsTypes(argList, typeList, nbRequiredArguments) {
  if (!tulip.debugChecks) return;
  var callerName = checkArgumentsTypes.caller.name;
  if (callerName.startsWith('tulip_')) {
    callerName = callerName.replace(/_/g, '.');
  }
  var nbArgs = argList.length;
  if (nbRequiredArguments && nbRequiredArguments > nbArgs) nbArgs = nbRequiredArguments;
  for (var i = 0 ; i < nbArgs ; ++i) {
    if (typeOf(typeList[i]) == 'string' && typeOf(argList[i]) != typeList[i]) {
      throw new TypeError('Error when calling function \'' + callerName + '\', parameter '+ i + ' must be of type \''+ typeList[i] +'\' (found \'' + typeOf(argList[i]) + '\' instead)');
    } else if (typeOf(typeList[i]) == 'function') {
      if (typeOf(argList[i]) != 'object' || !(argList[i] instanceof typeList[i])) {
        var typename = typeList[i].name;
        if (typename.startsWith('tulip_')) {
          typename = typename.replace(/_/g, '.');
        }
        throw new TypeError('Error when calling function \'' + callerName + '\', parameter '+ i + ' must be an instance of a \''+ typename +'\' object (found \'' + typeOf(argList[i]) + '\' instead)');
      }
    } else if (typeOf(typeList[i]) == 'array') {
      var typeOk = false;
      for (var j = 0 ; j < typeList[i].length ; ++j) {
        if (typeOf(typeList[i][j]) == 'string' && typeOf(argList[i]) == typeList[i][j]) {
          typeOk = true;
          break;
        } else if (typeOf(typeList[i][j]) == 'function') {
          if (typeOf(argList[i]) == 'object' && argList[i] instanceof typeList[i][j]) {
            typeOk = true;
            break;
          }
        }
      }
      if (!typeOk) {
        var errMsg = 'Error when calling function \'' + callerName + '\', parameter '+ i + ' must be of one of the following types : ';
        for (var j = 0 ; j < typeList[i].length ; ++j) {
          if (typeOf(typeList[i][j]) == 'string') {
            errMsg += typeList[i][j];
          } else if (typeOf(typeList[i][j]) == 'function') {
            var typename = typeList[i][j].name;
            if (typename.startsWith('tulip_')) {
              typename = typename.replace(/_/g, '.');
            }
            errMsg += 'an instance of a \''+ typename +'\' object';
          }
          if (j != typeList[i].length - 1) {
            errMsg += ', ';
          }
        }
        errMsg += ', found \'' + typeOf(argList[i]) + '\' instead';
        throw new TypeError(errMsg);
      }
    }
  }
}

function checkArrayOfType(array, type, i) {
  if (!tulip.debugChecks) return;
  var callerName = checkArrayOfType.caller.name;
  if (callerName.startsWith('tulip_')) {
    callerName = callerName.replace(/_/g, '.');
  }
  var types = [];
  for (var j = 0 ; j < array.length ; ++j) {
    types.push(type);
  }
  try {
    checkArgumentsTypes(array, types);
  } catch (e) {
    var typename = type;
    if (typeOf(typename) == 'function') {
      typename = type.name;
      if (typename.startsWith('tulip_')) {
        typename = typename.replace(/_/g, '.');
      }
    }
    throw new TypeError('Error when calling function \'' + callerName + '\', parameter '+ i + ' must be an array of '+ typename);
  }
}

var _isPointerDeleted = Module.cwrap('isPointerDeleted', 'number', ['number']);

function checkWrappedCppPointer(cppPointer) {
  //if (!tulip.debugChecks) return;
  if (cppPointer == 0 || _isPointerDeleted(cppPointer)) {
    var callerName = checkWrappedCppPointer.caller.name;
    if (callerName.startsWith('tulip_')) {
      callerName = callerName.replace(/_/g, '.');
    }
    throw 'Runtime error when calling function \'' + callerName +'\' : wrapped C++ object is null or has been deleted';
  }
}

function getArrayOfTulipType(arraySize, arrayFillFunc, tulipType) {
  var result = allocArrayInEmHeap(Uint32Array, arraySize);
  arrayFillFunc(result.byteOffset);
  var tulipTypeArray = new Array();
  for (var i = 0 ; i < arraySize ; ++i) {
    if (tulipType == tulip.Node || tulipType == tulip.Edge) {
      if (result[i] == UINT_MAX) {
        break;
      }
    }
    tulipTypeArray.push(tulipType(result[i]));
  }
  freeArrayInEmHeap(result);
  return tulipTypeArray;
}

tulip.CppObjectWrapper = function(cppPointer, wrappedTypename) {
  this.cppPointer = cppPointer;
  this.wrappedTypename = wrappedTypename;
};

tulip.CppObjectWrapper.prototype.getCppPointer = function() {
  return this.cppPointer;
};

tulip.CppObjectWrapper.prototype.cppPointerValid = function() {
  return this.cppPointer != 0 && !_isPointerDeleted(this.cppPointer);
};

tulip.CppObjectWrapper.prototype.getWrappedTypename = function() {
  return this.wrappedTypename;
};

tulip.CppObjectWrapper.prototype.setWrappedTypename = function(typename) {
  this.wrappedTypename = typename;
};

// ==================================================================================================================

var _PropertyInterface_delete = Module.cwrap('PropertyInterface_delete', null, ['number']);
var _PropertyInterface_getName = Module.cwrap('PropertyInterface_getName', 'string', ['number']);
var _PropertyInterface_getTypename = Module.cwrap('PropertyInterface_getTypename', 'string', ['number']);
var _PropertyInterface_getGraph = Module.cwrap('PropertyInterface_getGraph', 'number', ['number']);
var _PropertyInterface_getNodeStringValue = Module.cwrap('PropertyInterface_getNodeStringValue', 'string', ['number', 'number']);
var _PropertyInterface_getEdgeStringValue = Module.cwrap('PropertyInterface_getEdgeStringValue', 'string', ['number', 'number']);
var _PropertyInterface_copy = Module.cwrap('PropertyInterface_copy', null, ['number', 'number']);

/**
* This is the description for the tulip.node class.
*
* @class PropertyInterface
*/
tulip.PropertyInterface = function tulip_PropertyInterface(cppPointer, graphManaged) {
  var newObject = createObject(tulip.PropertyInterface, this);
  if (tulip_PropertyInterface.caller == null || tulip_PropertyInterface.caller.name != 'createObject') {
    tulip.CppObjectWrapper.call(newObject, cppPointer, 'tlp::PropertyInterface');
    newObject.graphManaged = graphManaged;
  }
  return newObject;
};
tulip.PropertyInterface.inheritsFrom(tulip.CppObjectWrapper);
tulip.PropertyInterface.prototype.destroy = function tulip_PropertyInterface_prototype_destroy() {
  checkWrappedCppPointer(this.cppPointer);
  if (!this.graphManaged) {
    _PropertyInterface_delete(this.cppPointer);
    this.cppPointer = 0;
  } else {
    console.log('Not destroying property named \'' + this.getName() + '\' as it is managed by the graph named \'' + this.getGraph().getName() + '\'');
  }
};
tulip.PropertyInterface.prototype.getName = function tulip_PropertyInterface_prototype_getName() {
  checkWrappedCppPointer(this.cppPointer);
  return _PropertyInterface_getName(this.cppPointer);
};
tulip.PropertyInterface.prototype.getTypename = function tulip_PropertyInterface_prototype_getTypename() {
  checkWrappedCppPointer(this.cppPointer);
  return _PropertyInterface_getTypename(this.cppPointer);
};
tulip.PropertyInterface.prototype.getNodeStringValue = function tulip_PropertyInterface_prototype_getNodeStringValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  return _PropertyInterface_getNodeStringValue(this.cppPointer, node.id);
};
tulip.PropertyInterface.prototype.getEdgeStringValue = function tulip_PropertyInterface_prototype_getEdgeStringValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  return _PropertyInterface_getEdgeStringValue(this.cppPointer, edge.id);
};
tulip.PropertyInterface.prototype.copy = function tulip_PropertyInterface_prototype_copy(propertyToCopy) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.PropertyInterface], 1);
  _PropertyInterface_copy(this.cppPointer, propertyToCopy.cppPointer);
};
/**
* Returns the graph that have created that property
*
* @method getGraph
* @return {Graph}
*/
tulip.PropertyInterface.prototype.getGraph = function tulip_PropertyInterface_prototype_getGraph() {
  checkWrappedCppPointer(this.cppPointer);
  return tulip.Graph(_PropertyInterface_getGraph(this.cppPointer));
};

// ==================================================================================================================

function createPropertyProxyIfAvailable(prop) {
  if (typeof Proxy == 'function') {
    var handler = {
      get: function(target, p) {
        if (typeOf(p) == 'string' && p.startsWith('[Node')) {
          return target.getNodeValue(tulip.Node(parseInt(p.substr(6, p.length-7))));
        } else if (typeOf(p) == 'string' && p.startsWith('[Edge')) {
          return target.getEdgeValue(tulip.Edge(parseInt(p.substr(6, p.length-7))));
        } else {
          return target[p];
        }
      },
      set: function(target, p, value){
        if (typeOf(p) == 'string' && p.startsWith('[Node')) {
          target.setNodeValue(tulip.Node(parseInt(p.substr(6, p.length-7))), value);
        } else if (typeOf(p) == 'string' && p.startsWith('[Edge')) {
          target.setEdgeValue(tulip.Edge(parseInt(p.substr(6, p.length-7))), value);
        } else {
          target[p] = value;
        }
      }
    };
    return new Proxy(prop, handler);
  } else {
    return prop;
  }
}

// ==================================================================================================================

var _createBooleanProperty = Module.cwrap('createBooleanProperty', 'number', ['number', 'string']);
var _BooleanProperty_setAllNodeValue = Module.cwrap('BooleanProperty_setAllNodeValue', null, ['number', 'number']);
var _BooleanProperty_getNodeDefaultValue = Module.cwrap('BooleanProperty_getNodeDefaultValue', 'number', ['number']);
var _BooleanProperty_setNodeValue = Module.cwrap('BooleanProperty_setNodeValue', null, ['number', 'number', 'number']);
var _BooleanProperty_getNodeValue = Module.cwrap('BooleanProperty_getNodeValue', 'number', ['number', 'number']);
var _BooleanProperty_setAllEdgeValue = Module.cwrap('BooleanProperty_setAllEdgeValue', null, ['number', 'number']);
var _BooleanProperty_setEdgeValue = Module.cwrap('BooleanProperty_setEdgeValue', null, ['number', 'number', 'number']);
var _BooleanProperty_getEdgeDefaultValue = Module.cwrap('BooleanProperty_getEdgeDefaultValue', 'number', ['number']);
var _BooleanProperty_getEdgeValue = Module.cwrap('BooleanProperty_getEdgeValue', 'number', ['number', 'number']);
var _BooleanProperty_getNodesEqualTo = Module.cwrap('BooleanProperty_getNodesEqualTo', null, ['number', 'number', 'number', 'number']);
var _BooleanProperty_getEdgesEqualTo = Module.cwrap('BooleanProperty_getEdgesEqualTo', null, ['number', 'number', 'number', 'number']);

tulip.BooleanProperty = function tulip_BooleanProperty() {
  var newObject = createObject(tulip.BooleanProperty, this);
  if (tulip_BooleanProperty.caller == null || tulip_BooleanProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createBooleanProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::BooleanProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.BooleanProperty.inheritsFrom(tulip.PropertyInterface);
tulip.BooleanProperty.prototype.getNodeDefaultValue = function tulip_BooleanProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _BooleanProperty_getNodeDefaultValue(this.cppPointer) > 0;
};
tulip.BooleanProperty.prototype.getNodeValue = function tulip_BooleanProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _BooleanProperty_getNodeValue(this.cppPointer, node.id) > 0;
};
tulip.BooleanProperty.prototype.setNodeValue = function tulip_BooleanProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'boolean']);
  _BooleanProperty_setNodeValue(this.cppPointer, node.id, val);
};
tulip.BooleanProperty.prototype.getEdgeDefaultValue = function tulip_BooleanProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _BooleanProperty_getEdgeDefaultValue(this.cppPointer) > 0;
};
tulip.BooleanProperty.prototype.getEdgeValue = function tulip_BooleanProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return _BooleanProperty_getEdgeValue(this.cppPointer, edge.id) > 0;
};
tulip.BooleanProperty.prototype.setEdgeValue = function tulip_BooleanProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'boolean']);
  _BooleanProperty_setEdgeValue(this.cppPointer, edge.id, val);
};
tulip.BooleanProperty.prototype.setAllNodeValue = function tulip_BooleanProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['boolean']);
  _BooleanProperty_setAllNodeValue(this.cppPointer, val);
};
tulip.BooleanProperty.prototype.setAllEdgeValue = function tulip_BooleanProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['boolean']);
  _BooleanProperty_setAllEdgeValue(this.cppPointer, val);
};
tulip.BooleanProperty.prototype.getNodesEqualTo = function tulip_BooleanProperty_prototype_getNodesEqualTo(val, graph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['boolean', tulip.Graph]);
  var propObject = this;
  return getArrayOfTulipType(propObject.getGraph().numberOfNodes(), function(byteOffset){_BooleanProperty_getNodesEqualTo(propObject.cppPointer, val, graph ? graph.cppPointer : 0, byteOffset);}, tulip.Node);
};
tulip.BooleanProperty.prototype.getEdgesEqualTo = function tulip_BooleanProperty_prototype_getEdgesEqualTo(val, graph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['boolean', tulip.Graph]);
  var propObject = this;
  return getArrayOfTulipType(propObject.getGraph().numberOfEdges(), function(byteOffset){_BooleanProperty_getEdgesEqualTo(propObject.cppPointer, val, graph ? graph.cppPointer : 0, byteOffset);}, tulip.Edge);
};
// ==================================================================================================================

var _createBooleanVectorProperty = Module.cwrap('createBooleanVectorProperty', 'number', ['number', 'string']);

var _BooleanVectorProperty_setAllNodeValue = Module.cwrap('BooleanVectorProperty_setAllNodeValue', null, ['number', 'number', 'number']);
var _BooleanVectorProperty_setNodeValue = Module.cwrap('BooleanVectorProperty_setNodeValue', null, ['number', 'number', 'number', 'number']);
var _BooleanVectorProperty_getNodeDefaultVectorSize = Module.cwrap('BooleanVectorProperty_getNodeDefaultVectorSize', 'number', ['number']);
var _BooleanVectorProperty_getNodeDefaultValue = Module.cwrap('BooleanVectorProperty_getNodeDefaultValue', null, ['number', 'number']);
var _BooleanVectorProperty_getNodeVectorSize = Module.cwrap('BooleanVectorProperty_getNodeVectorSize', 'number', ['number', 'number']);
var _BooleanVectorProperty_getNodeValue = Module.cwrap('BooleanVectorProperty_getNodeValue', null, ['number', 'number', 'number']);

var _BooleanVectorProperty_setAllEdgeValue = Module.cwrap('BooleanVectorProperty_setAllEdgeValue', null, ['number', 'number', 'number']);
var _BooleanVectorProperty_setEdgeValue = Module.cwrap('BooleanVectorProperty_setEdgeValue', null, ['number', 'number', 'number', 'number']);
var _BooleanVectorProperty_getEdgeDefaultVectorSize = Module.cwrap('BooleanVectorProperty_getEdgeDefaultVectorSize', 'number', ['number']);
var _BooleanVectorProperty_getEdgeDefaultValue = Module.cwrap('BooleanVectorProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _BooleanVectorProperty_getEdgeVectorSize = Module.cwrap('BooleanVectorProperty_getEdgeVectorSize', 'number', ['number', 'number']);
var _BooleanVectorProperty_getEdgeValue = Module.cwrap('BooleanVectorProperty_getEdgeValue', null, ['number', 'number', 'number']);

tulip.BooleanVectorProperty = function tulip_BooleanVectorProperty() {
  var newObject = createObject(tulip.BooleanVectorProperty, this);
  if (tulip_BooleanVectorProperty.caller == null || tulip_BooleanVectorProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createBooleanVectorProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::BooleanVectorProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.BooleanVectorProperty.inheritsFrom(tulip.PropertyInterface);
tulip.BooleanVectorProperty.prototype.getNodeDefaultValue = function tulip_BooleanVectorProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _BooleanVectorProperty_getNodeDefaultVectorSize(this.cppPointer);
  var booleanArray = allocArrayInEmHeap(Uint8Array, size);
  _BooleanVectorProperty_getNodeDefaultValue(this.cppPointer, booleanArray.byteOffset);
  var ret = Array.prototype.slice.call(booleanArray).map(Boolean);
  freeArrayInEmHeap(booleanArray);
  return ret;
};
tulip.BooleanVectorProperty.prototype.getNodeValue = function tulip_BooleanVectorProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var size = _BooleanVectorProperty_getNodeVectorSize(this.cppPointer, node.id);
  var booleanArray = allocArrayInEmHeap(Uint8Array, size);
  _BooleanVectorProperty_getNodeValue(this.cppPointer, node.id, booleanArray.byteOffset);
  var ret = Array.prototype.slice.call(booleanArray).map(Boolean);
  freeArrayInEmHeap(booleanArray);
  return ret;
};
tulip.BooleanVectorProperty.prototype.setNodeValue = function tulip_BooleanVectorProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'array'], 2);
  checkArrayOfType(val, 'boolean', 1);
  var booleanArray = allocArrayInEmHeap(Uint8Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    booleanArray[i] = val[i];
  }
  _BooleanVectorProperty_setNodeValue(this.cppPointer, node.id, booleanArray.byteOffset, val.length);
  freeArrayInEmHeap(booleanArray);
};
tulip.BooleanVectorProperty.prototype.getEdgeDefaultValue = function tulip_BooleanVectorProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _BooleanVectorProperty_getEdgeDefaultVectorSize(this.cppPointer);
  var booleanArray = allocArrayInEmHeap(Uint8Array, size);
  _BooleanVectorProperty_getEdgeDefaultValue(this.cppPointer, booleanArray.byteOffset);
  var ret = Array.prototype.slice.call(booleanArray).map(Boolean);
  freeArrayInEmHeap(booleanArray);
  return ret;
};
tulip.BooleanVectorProperty.prototype.getEdgeValue = function tulip_BooleanVectorProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var size = _BooleanVectorProperty_getEdgeVectorSize(this.cppPointer, edge.id);
  var booleanArray = allocArrayInEmHeap(Uint8Array, size);
  _BooleanVectorProperty_getEdgeValue(this.cppPointer, edge.id, booleanArray.byteOffset);
  var ret = Array.prototype.slice.call(booleanArray).map(Boolean);
  freeArrayInEmHeap(booleanArray);
  return ret;
};
tulip.BooleanVectorProperty.prototype.setEdgeValue = function tulip_BooleanVectorProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'array'], 2);
  checkArrayOfType(val, 'boolean', 1);
  var booleanArray = allocArrayInEmHeap(Uint8Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    booleanArray[i] = val[i];
  }
  _BooleanVectorProperty_setEdgeValue(this.cppPointer, edge.id, booleanArray.byteOffset, val.length);
  freeArrayInEmHeap(booleanArray);
};
tulip.BooleanVectorProperty.prototype.setAllNodeValue = function tulip_BooleanVectorProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'boolean', 0);
  var booleanArray = allocArrayInEmHeap(Uint8Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    booleanArray[i] = val[i];
  }
  _BooleanVectorProperty_setAllNodeValue(this.cppPointer, booleanArray.byteOffset, val.length);
  freeArrayInEmHeap(booleanArray);
};
tulip.BooleanVectorProperty.prototype.setAllEdgeValue = function tulip_BooleanVectorProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'boolean', 0);
  var booleanArray = allocArrayInEmHeap(Uint8Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    booleanArray[i] = val[i];
  }
  _BooleanVectorProperty_setAllEdgeValue(this.cppPointer, booleanArray.byteOffset, val.length);
  freeArrayInEmHeap(booleanArray);
};
// ==================================================================================================================

var _createDoubleProperty = Module.cwrap('createDoubleProperty', 'number', ['number', 'string']);
var _DoubleProperty_setAllNodeValue = Module.cwrap('DoubleProperty_setAllNodeValue', null, ['number', 'number']);
var _DoubleProperty_setNodeValue = Module.cwrap('DoubleProperty_setNodeValue', null, ['number', 'number', 'number']);
var _DoubleProperty_getNodeDefaultValue = Module.cwrap('DoubleProperty_getNodeDefaultValue', 'number', ['number']);
var _DoubleProperty_getNodeValue = Module.cwrap('DoubleProperty_getNodeValue', 'number', ['number', 'number']);
var _DoubleProperty_setAllEdgeValue = Module.cwrap('DoubleProperty_setAllEdgeValue', null, ['number', 'number']);
var _DoubleProperty_setEdgeValue = Module.cwrap('DoubleProperty_setEdgeValue', null, ['number', 'number', 'number']);
var _DoubleProperty_getEdgeDefaultValue = Module.cwrap('DoubleProperty_getEdgeDefaultValue', 'number', ['number']);
var _DoubleProperty_getEdgeValue = Module.cwrap('DoubleProperty_getEdgeValue', 'number', ['number', 'number']);
var _DoubleProperty_getSortedEdges = Module.cwrap('DoubleProperty_getSortedEdges', null, ['number', 'number', 'number', 'number']);

tulip.DoubleProperty = function tulip_DoubleProperty() {
  var newObject = createObject(tulip.DoubleProperty, this);
  if (tulip_DoubleProperty.caller == null || tulip_DoubleProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createDoubleProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::DoubleProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.DoubleProperty.inheritsFrom(tulip.PropertyInterface);
tulip.DoubleProperty.prototype.getNodeDefaultValue = function tulip_DoubleProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _DoubleProperty_getNodeDefaultValue(this.cppPointer);
};
tulip.DoubleProperty.prototype.getNodeValue = function tulip_DoubleProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _DoubleProperty_getNodeValue(this.cppPointer, node.id);
};
tulip.DoubleProperty.prototype.setNodeValue = function tulip_DoubleProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'number']);
  _DoubleProperty_setNodeValue(this.cppPointer, node.id, val);
};
tulip.DoubleProperty.prototype.getEdgeDefaultValue = function tulip_DoubleProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _DoubleProperty_getEdgeDefaultValue(this.cppPointer);
};
tulip.DoubleProperty.prototype.getEdgeValue = function tulip_DoubleProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return _DoubleProperty_getEdgeValue(this.cppPointer, edge.id);
};
tulip.DoubleProperty.prototype.setEdgeValue = function tulip_DoubleProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'number']);
  _DoubleProperty_setEdgeValue(this.cppPointer, edge.id, val);
};
tulip.DoubleProperty.prototype.setAllNodeValue = function tulip_DoubleProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number']);
  _DoubleProperty_setAllNodeValue(this.cppPointer, val);
};
tulip.DoubleProperty.prototype.setAllEdgeValue = function tulip_DoubleProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number']);
  _DoubleProperty_setAllEdgeValue(this.cppPointer, val);
};
tulip.DoubleProperty.prototype.getSortedEdges = function tulip_DoubleProperty_prototype_getSortedEdges(sg, ascendingOrder) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph, 'boolean']);
  if (typeOf(sg) == 'undefined') sg = this.getGraph();
  if (typeOf(ascendingOrder) == 'undefined') ascendingOrder = true;
  var propertyObject = this;
  return getArrayOfTulipType(sg.numberOfEdges(), function(byteOffset){_DoubleProperty_getSortedEdges(propertyObject.cppPointer, sg.cppPointer, ascendingOrder, byteOffset);}, tulip.Edge);
};

// ==================================================================================================================

var _createDoubleVectorProperty = Module.cwrap('createDoubleVectorProperty', 'number', ['number', 'string']);

var _DoubleVectorProperty_setAllNodeValue = Module.cwrap('DoubleVectorProperty_setAllNodeValue', null, ['number', 'number', 'number']);
var _DoubleVectorProperty_setNodeValue = Module.cwrap('DoubleVectorProperty_setNodeValue', null, ['number', 'number', 'number', 'number']);
var _DoubleVectorProperty_getNodeDefaultVectorSize = Module.cwrap('DoubleVectorProperty_getNodeDefaultVectorSize', 'number', ['number']);
var _DoubleVectorProperty_getNodeDefaultValue = Module.cwrap('DoubleVectorProperty_getNodeDefaultValue', null, ['number', 'number']);
var _DoubleVectorProperty_getNodeVectorSize = Module.cwrap('DoubleVectorProperty_getNodeVectorSize', 'number', ['number', 'number']);
var _DoubleVectorProperty_getNodeValue = Module.cwrap('DoubleVectorProperty_getNodeValue', null, ['number', 'number', 'number']);

var _DoubleVectorProperty_setAllEdgeValue = Module.cwrap('DoubleVectorProperty_setAllEdgeValue', null, ['number', 'number', 'number']);
var _DoubleVectorProperty_setEdgeValue = Module.cwrap('DoubleVectorProperty_setEdgeValue', null, ['number', 'number', 'number', 'number']);
var _DoubleVectorProperty_getEdgeDefaultVectorSize = Module.cwrap('DoubleVectorProperty_getEdgeDefaultVectorSize', 'number', ['number']);
var _DoubleVectorProperty_getEdgeDefaultValue = Module.cwrap('DoubleVectorProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _DoubleVectorProperty_getEdgeVectorSize = Module.cwrap('DoubleVectorProperty_getEdgeVectorSize', 'number', ['number', 'number']);
var _DoubleVectorProperty_getEdgeValue = Module.cwrap('DoubleVectorProperty_getEdgeValue', null, ['number', 'number', 'number']);

tulip.DoubleVectorProperty = function tulip_DoubleVectorProperty() {
  var newObject = createObject(tulip.DoubleVectorProperty, this);
  if (tulip_DoubleVectorProperty.caller == null || tulip_DoubleVectorProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createDoubleVectorProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::DoubleVectorProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.DoubleVectorProperty.inheritsFrom(tulip.PropertyInterface);
tulip.DoubleVectorProperty.prototype.getNodeDefaultValue = function tulip_DoubleVectorProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _DoubleVectorProperty_getNodeDefaultVectorSize(this.cppPointer);
  var doubleArray = allocArrayInEmHeap(Float64Array, size);
  _DoubleVectorProperty_getNodeDefaultValue(this.cppPointer, doubleArray.byteOffset);
  var ret = Array.prototype.slice.call(doubleArray);
  freeArrayInEmHeap(doubleArray);
  return ret;
};
tulip.DoubleVectorProperty.prototype.getNodeValue = function tulip_DoubleVectorProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var size = _DoubleVectorProperty_getNodeVectorSize(this.cppPointer, node.id);
  var doubleArray = allocArrayInEmHeap(Float64Array, size);
  _DoubleVectorProperty_getNodeValue(this.cppPointer, node.id, doubleArray.byteOffset);
  var ret = Array.prototype.slice.call(doubleArray);
  freeArrayInEmHeap(doubleArray);
  return ret;
};
tulip.DoubleVectorProperty.prototype.setNodeValue = function tulip_DoubleVectorProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'array'], 2);
  checkArrayOfType(val, 'number', 1);
  var doubleArray = allocArrayInEmHeap(Float64Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    doubleArray[i] = val[i];
  }
  _DoubleVectorProperty_setNodeValue(this.cppPointer, node.id, doubleArray.byteOffset, val.length);
  freeArrayInEmHeap(doubleArray);
};
tulip.DoubleVectorProperty.prototype.getEdgeDefaultValue = function tulip_DoubleVectorProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _DoubleVectorProperty_getEdgeDefaultVectorSize(this.cppPointer);
  var doubleArray = allocArrayInEmHeap(Float64Array, size);
  _DoubleVectorProperty_getEdgeDefaultValue(this.cppPointer, doubleArray.byteOffset);
  var ret = Array.prototype.slice.call(doubleArray);
  freeArrayInEmHeap(doubleArray);
  return ret;
};
tulip.DoubleVectorProperty.prototype.getEdgeValue = function tulip_DoubleVectorProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var size = _DoubleVectorProperty_getEdgeVectorSize(this.cppPointer, edge.id);
  var doubleArray = allocArrayInEmHeap(Float64Array, size);
  _DoubleVectorProperty_getEdgeValue(this.cppPointer, edge.id, doubleArray.byteOffset);
  var ret = Array.prototype.slice.call(doubleArray);
  freeArrayInEmHeap(doubleArray);
  return ret;
};
tulip.DoubleVectorProperty.prototype.setEdgeValue = function tulip_DoubleVectorProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'array'], 2);
  checkArrayOfType(val, 'number', 1);
  var doubleArray = allocArrayInEmHeap(Float64Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    doubleArray[i] = val[i];
  }
  _DoubleVectorProperty_setEdgeValue(this.cppPointer, edge.id, doubleArray.byteOffset, val.length);
  freeArrayInEmHeap(doubleArray);
};
tulip.DoubleVectorProperty.prototype.setAllNodeValue = function tulip_DoubleVectorProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'number', 0);
  var doubleArray = allocArrayInEmHeap(Float64Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    doubleArray[i] = val[i];
  }
  _DoubleVectorProperty_setAllNodeValue(this.cppPointer, doubleArray.byteOffset, val.length);
  freeArrayInEmHeap(doubleArray);
};
tulip.DoubleVectorProperty.prototype.setAllEdgeValue = function tulip_DoubleVectorProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'number', 0);
  var doubleArray = allocArrayInEmHeap(Float64Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    doubleArray[i] = val[i];
  }
  _DoubleVectorProperty_setAllEdgeValue(this.cppPointer, doubleArray.byteOffset, val.length);
  freeArrayInEmHeap(doubleArray);
};

// ==================================================================================================================

var _createIntegerProperty = Module.cwrap('createIntegerProperty', 'number', ['number', 'string']);
var _IntegerProperty_setAllNodeValue = Module.cwrap('IntegerProperty_setAllNodeValue', null, ['number', 'number']);
var _IntegerProperty_setNodeValue = Module.cwrap('IntegerProperty_setNodeValue', null, ['number', 'number', 'number']);
var _IntegerProperty_getNodeDefaultValue = Module.cwrap('IntegerProperty_getNodeDefaultValue', 'number', ['number']);
var _IntegerProperty_getNodeValue = Module.cwrap('IntegerProperty_getNodeValue', 'number', ['number', 'number']);
var _IntegerProperty_setAllEdgeValue = Module.cwrap('IntegerProperty_setAllEdgeValue', null, ['number', 'number']);
var _IntegerProperty_setEdgeValue = Module.cwrap('IntegerProperty_setEdgeValue', null, ['number', 'number', 'number']);
var _IntegerProperty_getEdgeDefaultValue = Module.cwrap('IntegerProperty_getEdgeDefaultValue', 'number', ['number']);
var _IntegerProperty_getEdgeValue = Module.cwrap('IntegerProperty_getEdgeValue', 'number', ['number', 'number']);

tulip.IntegerProperty = function tulip_IntegerProperty() {
  var newObject = createObject(tulip.IntegerProperty, this);
  if (tulip_IntegerProperty.caller == null || tulip_IntegerProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createIntegerProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::IntegerProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.IntegerProperty.inheritsFrom(tulip.PropertyInterface);
tulip.IntegerProperty.prototype.getNodeDefaultValue = function tulip_IntegerProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _IntegerProperty_getNodeDefaultValue(this.cppPointer);
};
tulip.IntegerProperty.prototype.getNodeValue = function tulip_IntegerProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _IntegerProperty_getNodeValue(this.cppPointer, node.id);
};
tulip.IntegerProperty.prototype.setNodeValue = function tulip_IntegerProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'number']);
  _IntegerProperty_setNodeValue(this.cppPointer, node.id, val);
};
tulip.IntegerProperty.prototype.getEdgeDefaultValue = function tulip_IntegerProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _IntegerProperty_getEdgeDefaultValue(this.cppPointer);
};
tulip.IntegerProperty.prototype.getEdgeValue = function tulip_IntegerProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return _IntegerProperty_getEdgeValue(this.cppPointer, edge.id);
};
tulip.IntegerProperty.prototype.setEdgeValue = function tulip_IntegerProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'number']);
  _IntegerProperty_setEdgeValue(this.cppPointer, edge.id, val);
};
tulip.IntegerProperty.prototype.setAllNodeValue = function tulip_IntegerProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number']);
  _IntegerProperty_setAllNodeValue(this.cppPointer, val);
};
tulip.IntegerProperty.prototype.setAllEdgeValue = function tulip_IntegerProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number']);
  _IntegerProperty_setAllEdgeValue(this.cppPointer, val);
};

// ==================================================================================================================

var _createIntegerVectorProperty = Module.cwrap('createIntegerVectorProperty', 'number', ['number', 'string']);

var _IntegerVectorProperty_setAllNodeValue = Module.cwrap('IntegerVectorProperty_setAllNodeValue', null, ['number', 'number', 'number']);
var _IntegerVectorProperty_setNodeValue = Module.cwrap('IntegerVectorProperty_setNodeValue', null, ['number', 'number', 'number', 'number']);
var _IntegerVectorProperty_getNodeDefaultVectorSize = Module.cwrap('IntegerVectorProperty_getNodeDefaultVectorSize', 'number', ['number']);
var _IntegerVectorProperty_getNodeDefaultValue = Module.cwrap('IntegerVectorProperty_getNodeDefaultValue', null, ['number', 'number']);
var _IntegerVectorProperty_getNodeVectorSize = Module.cwrap('IntegerVectorProperty_getNodeVectorSize', 'number', ['number', 'number']);
var _IntegerVectorProperty_getNodeValue = Module.cwrap('IntegerVectorProperty_getNodeValue', null, ['number', 'number', 'number']);

var _IntegerVectorProperty_setAllEdgeValue = Module.cwrap('IntegerVectorProperty_setAllEdgeValue', null, ['number', 'number', 'number']);
var _IntegerVectorProperty_setEdgeValue = Module.cwrap('IntegerVectorProperty_setEdgeValue', null, ['number', 'number', 'number', 'number']);
var _IntegerVectorProperty_getEdgeDefaultVectorSize = Module.cwrap('IntegerVectorProperty_getEdgeDefaultVectorSize', 'number', ['number']);
var _IntegerVectorProperty_getEdgeDefaultValue = Module.cwrap('IntegerVectorProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _IntegerVectorProperty_getEdgeVectorSize = Module.cwrap('IntegerVectorProperty_getEdgeVectorSize', 'number', ['number', 'number']);
var _IntegerVectorProperty_getEdgeValue = Module.cwrap('IntegerVectorProperty_getEdgeValue', null, ['number', 'number', 'number']);

tulip.IntegerVectorProperty = function tulip_IntegerVectorProperty() {
  var newObject = createObject(tulip.IntegerVectorProperty, this);
  if (tulip_IntegerVectorProperty.caller == null || tulip_IntegerVectorProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createIntegerVectorProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::IntegerVectorProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.IntegerVectorProperty.inheritsFrom(tulip.PropertyInterface);
tulip.IntegerVectorProperty.prototype.getNodeDefaultValue = function tulip_IntegerVectorProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _IntegerVectorProperty_getNodeDefaultVectorSize(this.cppPointer);
  var integerArray = allocArrayInEmHeap(Int32Array, size);
  _IntegerVectorProperty_getNodeDefaultValue(this.cppPointer, integerArray.byteOffset);
  var ret = Array.prototype.slice.call(integerArray);
  freeArrayInEmHeap(integerArray);
  return ret;
};
tulip.IntegerVectorProperty.prototype.getNodeValue = function tulip_IntegerVectorProperty_prototype_getNodeValue2(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var size = _IntegerVectorProperty_getNodeVectorSize(this.cppPointer, node.id);
  var integerArray = allocArrayInEmHeap(Int32Array, size);
  _IntegerVectorProperty_getNodeValue(this.cppPointer, node.id, integerArray.byteOffset);
  var ret = Array.prototype.slice.call(integerArray);
  freeArrayInEmHeap(integerArray);
  return ret;
};
tulip.IntegerVectorProperty.prototype.setNodeValue = function tulip_IntegerVectorProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'array'], 2);
  checkArrayOfType(val, 'number', 1);
  var integerArray = allocArrayInEmHeap(Int32Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    integerArray[i] = val[i];
  }
  _IntegerVectorProperty_setNodeValue(this.cppPointer, node.id, integerArray.byteOffset, val.length);
  freeArrayInEmHeap(integerArray);
};
tulip.IntegerVectorProperty.prototype.getEdgeDefaultValue = function tulip_IntegerVectorProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _IntegerVectorProperty_getEdgeDefaultVectorSize(this.cppPointer);
  var integerArray = allocArrayInEmHeap(Int32Array, size);
  _IntegerVectorProperty_getEdgeDefaultValue(this.cppPointer, integerArray.byteOffset);
  var ret = Array.prototype.slice.call(integerArray);
  freeArrayInEmHeap(integerArray);
  return ret;
};
tulip.IntegerVectorProperty.prototype.getEdgeValue = function tulip_IntegerVectorProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var size = _IntegerVectorProperty_getEdgeVectorSize(this.cppPointer, edge.id);
  var integerArray = allocArrayInEmHeap(Int32Array, size);
  _IntegerVectorProperty_getEdgeValue(this.cppPointer, edge.id, integerArray.byteOffset);
  var ret = Array.prototype.slice.call(integerArray);
  freeArrayInEmHeap(integerArray);
  return ret;
};
tulip.IntegerVectorProperty.prototype.setEdgeValue = function tulip_IntegerVectorProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'array'], 2);
  checkArrayOfType(val, 'number', 1);
  var integerArray = allocArrayInEmHeap(Int32Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    integerArray[i] = val[i];
  }
  _IntegerVectorProperty_setEdgeValue(this.cppPointer, edge.id, integerArray.byteOffset, val.length);
  freeArrayInEmHeap(integerArray);
};
tulip.IntegerVectorProperty.prototype.setAllNodeValue = function tulip_IntegerVectorProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'number', 0);
  var integerArray = allocArrayInEmHeap(Int32Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    integerArray[i] = val[i];
  }
  _IntegerVectorProperty_setAllNodeValue(this.cppPointer, integerArray.byteOffset, val.length);
  freeArrayInEmHeap(integerArray);
};
tulip.IntegerVectorProperty.prototype.setAllEdgeValue = function tulip_IntegerVectorProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'number', 0);
  var integerArray = allocArrayInEmHeap(Int32Array, val.length);
  for (var i = 0 ; i < val.length ; ++i) {
    integerArray[i] = val[i];
  }
  _IntegerVectorProperty_setAllEdgeValue(this.cppPointer, integerArray.byteOffset, val.length);
  freeArrayInEmHeap(integerArray);
};

// ==================================================================================================================

var _createStringProperty = Module.cwrap('createStringProperty', 'number', ['number', 'string']);
var _StringProperty_setAllNodeValue = Module.cwrap('StringProperty_setAllNodeValue', null, ['number', 'string']);
var _StringProperty_setNodeValue = Module.cwrap('StringProperty_setNodeValue', null, ['number', 'number', 'string']);
var _StringProperty_getNodeDefaultValue = Module.cwrap('StringProperty_getNodeDefaultValue', 'string', ['number']);
var _StringProperty_getNodeValue = Module.cwrap('StringProperty_getNodeValue', 'string', ['number', 'number']);
var _StringProperty_setAllEdgeValue = Module.cwrap('StringProperty_setAllEdgeValue', null, ['number', 'string']);
var _StringProperty_setEdgeValue = Module.cwrap('StringProperty_setEdgeValue', null, ['number', 'number', 'string']);
var _StringProperty_getEdgeDefaultValue = Module.cwrap('StringProperty_getEdgeDefaultValue', 'string', ['number']);
var _StringProperty_getEdgeValue = Module.cwrap('StringProperty_getEdgeValue', 'string', ['number', 'number']);

tulip.StringProperty = function tulip_StringProperty() {
  var newObject = createObject(tulip.StringProperty, this);
  if (tulip_StringProperty.caller == null || tulip_StringProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createStringProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::StringProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.StringProperty.inheritsFrom(tulip.PropertyInterface);
tulip.StringProperty.prototype.getNodeDefaultValue = function tulip_StringProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _StringProperty_getNodeDefaultValue(this.cppPointer);
};
tulip.StringProperty.prototype.getNodeValue = function tulip_StringProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _StringProperty_getNodeValue(this.cppPointer, node.id);
};
tulip.StringProperty.prototype.setNodeValue = function tulip_StringProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'string']);
  _StringProperty_setNodeValue(this.cppPointer, node.id, val);
};
tulip.StringProperty.prototype.getEdgeDefaultValue = function tulip_StringProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  return _StringProperty_getEdgeDefaultValue(this.cppPointer);
};
tulip.StringProperty.prototype.getEdgeValue = function tulip_StringProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return _StringProperty_getEdgeValue(this.cppPointer, edge.id);
};
tulip.StringProperty.prototype.setEdgeValue = function tulip_StringProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'string']);
  _StringProperty_setEdgeValue(this.cppPointer, edge.id, val);
};
tulip.StringProperty.prototype.setAllNodeValue = function tulip_StringProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  _StringProperty_setAllNodeValue(this.cppPointer, val);
};
tulip.StringProperty.prototype.setAllEdgeValue = function tulip_StringProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  _StringProperty_setAllEdgeValue(this.cppPointer, val);
};

// ==================================================================================================================

var _createStringVectorProperty = Module.cwrap('createStringVectorProperty', 'number', ['number', 'string']);
var _StringVectorProperty_setAllNodeValue = Module.cwrap('StringVectorProperty_setAllNodeValue', null, ['number', 'number', 'number', 'number']);
var _StringVectorProperty_setNodeValue = Module.cwrap('StringVectorProperty_setNodeValue', null, ['number', 'number', 'number', 'number', 'number']);
var _StringVectorProperty_setAllEdgeValue = Module.cwrap('StringVectorProperty_setAllEdgeValue', null, ['number', 'number', 'number', 'number']);
var _StringVectorProperty_setEdgeValue = Module.cwrap('StringVectorProperty_setEdgeValue', null, ['number', 'number', 'number', 'number', 'number']);

var _StringVectorProperty_getNodeDefaultVectorSize = Module.cwrap('StringVectorProperty_getNodeDefaultVectorSize', 'number', ['number']);
var _StringVectorProperty_getNodeDefaultStringsLengths = Module.cwrap('StringVectorProperty_getNodeDefaultStringsLengths', 'number', ['number', 'number']);
var _StringVectorProperty_getNodeDefaultValue = Module.cwrap('StringVectorProperty_getNodeDefaultValue', null, ['number', 'number']);

var _StringVectorProperty_getNodeVectorSize = Module.cwrap('StringVectorProperty_getNodeVectorSize', 'number', ['number', 'number']);
var _StringVectorProperty_getNodeStringsLengths = Module.cwrap('StringVectorProperty_getNodeStringsLengths', 'number', ['number', 'number', 'number']);
var _StringVectorProperty_getNodeValue = Module.cwrap('StringVectorProperty_getNodeValue', null, ['number', 'number', 'number']);

var _StringVectorProperty_getEdgeVectorSize = Module.cwrap('StringVectorProperty_getEdgeVectorSize', 'number', ['number', 'number']);
var _StringVectorProperty_getEdgeStringsLengths = Module.cwrap('StringVectorProperty_getEdgeStringsLengths', 'number', ['number', 'number', 'number']);
var _StringVectorProperty_getEdgeValue = Module.cwrap('StringVectorProperty_getEdgeValue', null, ['number', 'number', 'number']);

var _StringVectorProperty_getEdgeDefaultVectorSize = Module.cwrap('StringVectorProperty_getEdgeDefaultVectorSize', 'number', ['number']);
var _StringVectorProperty_getEdgeDefaultStringsLengths = Module.cwrap('StringVectorProperty_getEdgeDefaultStringsLengths', 'number', ['number', 'number']);
var _StringVectorProperty_getEdgeDefaultValue = Module.cwrap('StringVectorProperty_getEdgeDefaultValue', null, ['number', 'number']);

tulip.StringVectorProperty = function tulip_StringVectorProperty() {
  var newObject = createObject(tulip.StringVectorProperty, this);
  if (tulip_StringVectorProperty.caller == null || tulip_StringVectorProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createStringVectorProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::StringVectorProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.StringVectorProperty.inheritsFrom(tulip.PropertyInterface);

tulip.StringVectorProperty.prototype.getNodeDefaultValue = function tulip_StringVectorProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var nbStrings = _StringVectorProperty_getNodeDefaultVectorSize(this.cppPointer);
  var uintArray = allocArrayInEmHeap(Uint32Array, nbStrings);
  var nbBytes = _StringVectorProperty_getNodeDefaultStringsLengths(this.cppPointer, uintArray.byteOffset);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  _StringVectorProperty_getNodeDefaultValue(this.cppPointer, ucharArray.byteOffset);
  var ret = bytesTypedArrayToStringArray(ucharArray, uintArray, nbStrings);
  freeArrayInEmHeap(uintArray);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.StringVectorProperty.prototype.getNodeValue = function tulip_StringVectorProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var nbStrings = _StringVectorProperty_getNodeVectorSize(this.cppPointer, node.id);
  var uintArray = allocArrayInEmHeap(Uint32Array, nbStrings);
  var nbBytes = _StringVectorProperty_getNodeStringsLengths(this.cppPointer, node.id, uintArray.byteOffset);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  _StringVectorProperty_getNodeValue(this.cppPointer, node.id, ucharArray.byteOffset);
  var ret = bytesTypedArrayToStringArray(ucharArray, uintArray, nbStrings);
  freeArrayInEmHeap(uintArray);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.StringVectorProperty.prototype.setNodeValue = function tulip_StringVectorProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'array']);
  checkArrayOfType(val, 'string', 1);
  var data = stringArrayToBytesAndOffsetsTypedArray(val);
  _StringVectorProperty_setNodeValue(this.cppPointer, node.id, data.bytesArray.byteOffset, data.offsetsArray.byteOffset, val.length);
  freeArrayInEmHeap(data.bytesArray);
  freeArrayInEmHeap(data.offsetsArray);
};
tulip.StringVectorProperty.prototype.getEdgeDefaultValue = function tulip_StringVectorProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var nbStrings = _StringVectorProperty_getEdgeDefaultVectorSize(this.cppPointer);
  var uintArray = allocArrayInEmHeap(Uint32Array, nbStrings);
  var nbBytes = _StringVectorProperty_getEdgeDefaultStringsLengths(this.cppPointer, uintArray.byteOffset);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  _StringVectorProperty_getEdgeDefaultValue(this.cppPointer, ucharArray.byteOffset);
  var ret = bytesTypedArrayToStringArray(ucharArray, uintArray, nbStrings);
  freeArrayInEmHeap(uintArray);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.StringVectorProperty.prototype.getEdgeValue = function tulip_StringVectorProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  var nbStrings = _StringVectorProperty_getEdgeVectorSize(this.cppPointer, edge.id);
  var uintArray = allocArrayInEmHeap(Uint32Array, nbStrings);
  var nbBytes = _StringVectorProperty_getEdgeStringsLengths(this.cppPointer, edge.id, uintArray.byteOffset);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  _StringVectorProperty_getEdgeValue(this.cppPointer, edge.id, ucharArray.byteOffset);
  var ret = bytesTypedArrayToStringArray(ucharArray, uintArray, nbStrings);
  freeArrayInEmHeap(uintArray);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.StringVectorProperty.prototype.setEdgeValue = function tulip_StringVectorProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'array']);
  checkArrayOfType(val, 'string', 1);
  var data = stringArrayToBytesAndOffsetsTypedArray(val);
  _StringVectorProperty_setEdgeValue(this.cppPointer, edge.id, data.bytesArray.byteOffset, data.offsetsArray.byteOffset, val.length);
  freeArrayInEmHeap(data.bytesArray);
  freeArrayInEmHeap(data.offsetsArray);
};
tulip.StringVectorProperty.prototype.setAllNodeValue = function tulip_StringVectorProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array']);
  checkArrayOfType(val, 'string', 0);
  var data = stringArrayToBytesAndOffsetsTypedArray(val);
  _StringVectorProperty_setAllNodeValue(this.cppPointer, data.bytesArray.byteOffset, data.offsetsArray.byteOffset, val.length);
  freeArrayInEmHeap(data.bytesArray);
  freeArrayInEmHeap(data.offsetsArray);
};
tulip.StringVectorProperty.prototype.setAllEdgeValue = function tulip_StringVectorProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array']);
  checkArrayOfType(val, 'string', 0);
  var data = stringArrayToBytesAndOffsetsTypedArray(val);
  _StringVectorProperty_setAllEdgeValue(this.cppPointer, data.bytesArray.byteOffset, data.offsetsArray.byteOffset, val.length);
  freeArrayInEmHeap(data.bytesArray);
  freeArrayInEmHeap(data.offsetsArray);
};

// ==================================================================================================================

tulip.Color = function tulip_Color() {
  var newObject = createObject(tulip.Color, this);
  newObject.r = newObject.g = newObject.b = newObject.a = 0;
  if (arguments.length > 0) {
    if (arguments.length == 1 && typeOf(arguments[0]) == 'string') {
      var hexColorRegexp = new RegExp('^#[A-Fa-f0-9]{6}$');
      if (hexColorRegexp.test(arguments[0])) {
        newObject.r = parseInt(arguments[0].substr(1, 2), 16);
        newObject.g = parseInt(arguments[0].substr(3, 2), 16);
        newObject.b = parseInt(arguments[0].substr(5, 2), 16);
        newObject.a = 255;
      }
    } else {
      checkArgumentsTypes(arguments, ['number', 'number', 'number', 'number'], 3);
      newObject.r = arguments[0];
      newObject.g = arguments[1];
      newObject.b = arguments[2];
      if (arguments.length < 4) {
        newObject.a = 255;
      } else {
        newObject.a = arguments[3];
      }
    }
  }
  return newObject;
};

tulip.Color.prototype.rgbHexStr = function tulip_Color_prototype_rgbHexStr() {
  return '#' + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
};

// ==================================================================================================================

var _createColorProperty = Module.cwrap('createColorProperty', 'number', ['number', 'string']);
var _ColorProperty_setAllNodeValue = Module.cwrap('ColorProperty_setAllNodeValue', null, ['number', 'number', 'number', 'number', 'number']);
var _ColorProperty_setNodeValue = Module.cwrap('ColorProperty_setNodeValue', null, ['number', 'number', 'number', 'number', 'number', 'number']);
var _ColorProperty_getNodeDefaultValue = Module.cwrap('ColorProperty_getNodeDefaultValue', null, ['number', 'number']);
var _ColorProperty_getNodeValue = Module.cwrap('ColorProperty_getNodeValue', null, ['number', 'number', 'number']);
var _ColorProperty_setAllEdgeValue = Module.cwrap('ColorProperty_setAllEdgeValue', null, ['number', 'number', 'number', 'number', 'number']);
var _ColorProperty_setEdgeValue = Module.cwrap('ColorProperty_setEdgeValue', null, ['number', 'number', 'number', 'number', 'number', 'number']);
var _ColorProperty_getEdgeDefaultValue = Module.cwrap('ColorProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _ColorProperty_getEdgeValue = Module.cwrap('ColorProperty_getEdgeValue', null, ['number', 'number', 'number']);

tulip.ColorProperty = function tulip_ColorProperty() {
  var newObject = createObject(tulip.ColorProperty, this);
  if (tulip_ColorProperty.caller == null || tulip_ColorProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createColorProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::ColorProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.ColorProperty.inheritsFrom(tulip.PropertyInterface);
tulip.ColorProperty.prototype.getNodeDefaultValue = function tulip_ColorProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var ucharArray = allocArrayInEmHeap(Uint8Array, 4);
  _ColorProperty_getNodeDefaultValue(this.cppPointer, ucharArray.byteOffset);
  var ret = tulip.Color(ucharArray[0], ucharArray[1], ucharArray[2], ucharArray[3]);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.ColorProperty.prototype.getNodeValue = function tulip_ColorProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var ucharArray = allocArrayInEmHeap(Uint8Array, 4);
  _ColorProperty_getNodeValue(this.cppPointer, node.id, ucharArray.byteOffset);
  var ret = tulip.Color(ucharArray[0], ucharArray[1], ucharArray[2], ucharArray[3]);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.ColorProperty.prototype.setNodeValue = function tulip_ColorProperty_prototype_setNodeValue(node, color) {
  checkArgumentsTypes(arguments, [tulip.Node, tulip.Color], 2);
  _ColorProperty_setNodeValue(this.cppPointer, node.id, color.r, color.g, color.b, color.a);
};
tulip.ColorProperty.prototype.getEdgeDefaultValue = function tulip_ColorProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var ucharArray = allocArrayInEmHeap(Uint8Array, 4);
  _ColorProperty_getEdgeDefaultValue(this.cppPointer, ucharArray.byteOffset);
  var ret = tulip.Color(ucharArray[0], ucharArray[1], ucharArray[2], ucharArray[3]);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.ColorProperty.prototype.getEdgeValue = function tulip_ColorProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var ucharArray = allocArrayInEmHeap(Uint8Array, 4);
  _ColorProperty_getEdgeValue(this.cppPointer, edge.id, ucharArray.byteOffset);
  var ret = tulip.Color(ucharArray[0], ucharArray[1], ucharArray[2], ucharArray[3]);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.ColorProperty.prototype.setEdgeValue = function tulip_ColorProperty_prototype_setEdgeValue(edge, color) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, tulip.Color], 2);
  _ColorProperty_setEdgeValue(this.cppPointer, edge.id, color.r, color.g, color.b, color.a);
};
tulip.ColorProperty.prototype.setAllNodeValue = function tulip_ColorProperty_prototype_setAllNodeValue(color) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Color], 1);
  _ColorProperty_setAllNodeValue(this.cppPointer, color.r, color.g, color.b, color.a);
};
tulip.ColorProperty.prototype.setAllEdgeValue = function tulip_ColorProperty_prototype_setAllEdgeValue(color) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Color], 1);
  _ColorProperty_setAllEdgeValue(this.cppPointer, color.r, color.g, color.b, color.a);
};

// ==================================================================================================================

var _createColorVectorProperty = Module.cwrap('createColorVectorProperty', 'number', ['number', 'string']);

var _ColorVectorProperty_setAllNodeValue = Module.cwrap('ColorVectorProperty_setAllNodeValue', null, ['number', 'number', 'number']);
var _ColorVectorProperty_setNodeValue = Module.cwrap('ColorVectorProperty_setNodeValue', null, ['number', 'number', 'number', 'number']);
var _ColorVectorProperty_getNodeDefaultVectorSize = Module.cwrap('ColorVectorProperty_getNodeDefaultVectorSize', 'number', ['number']);
var _ColorVectorProperty_getNodeDefaultValue = Module.cwrap('ColorVectorProperty_getNodeDefaultValue', null, ['number', 'number']);
var _ColorVectorProperty_getNodeVectorSize = Module.cwrap('ColorVectorProperty_getNodeVectorSize', 'number', ['number', 'number']);
var _ColorVectorProperty_getNodeValue = Module.cwrap('ColorVectorProperty_getNodeValue', null, ['number', 'number', 'number']);

var _ColorVectorProperty_setAllEdgeValue = Module.cwrap('ColorVectorProperty_setAllEdgeValue', null, ['number', 'number', 'number']);
var _ColorVectorProperty_setEdgeValue = Module.cwrap('ColorVectorProperty_setEdgeValue', null, ['number', 'number', 'number', 'number']);
var _ColorVectorProperty_getEdgeDefaultVectorSize = Module.cwrap('ColorVectorProperty_getEdgeDefaultVectorSize', 'number', ['number']);
var _ColorVectorProperty_getEdgeDefaultValue = Module.cwrap('ColorVectorProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _ColorVectorProperty_getEdgeVectorSize = Module.cwrap('ColorVectorProperty_getEdgeVectorSize', 'number', ['number', 'number']);
var _ColorVectorProperty_getEdgeValue = Module.cwrap('ColorVectorProperty_getEdgeValue', null, ['number', 'number', 'number']);

tulip.ColorVectorProperty = function tulip_ColorVectorProperty() {
  var newObject = createObject(tulip.ColorVectorProperty, this);
  if (tulip_ColorVectorProperty.caller == null || tulip_ColorVectorProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createColorVectorProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::ColorVectorProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.ColorVectorProperty.inheritsFrom(tulip.PropertyInterface);
tulip.ColorVectorProperty.prototype.getNodeDefaultValue = function tulip_ColorVectorProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _ColorVectorProperty_getNodeDefaultVectorSize(this.cppPointer);
  var colorArray = allocArrayInEmHeap(Uint8Array, size*4);
  _ColorVectorProperty_getNodeDefaultValue(this.cppPointer, colorArray.byteOffset);
  var ret = [];
  for (var i = 0 ; i < size ; ++i) {
    ret.push(tulip.Color(colorArray[4*i],colorArray[4*i+1],colorArray[4*i+2],colorArray[4*i+3]));
  }
  freeArrayInEmHeap(colorArray);
  return ret;
};
tulip.ColorVectorProperty.prototype.getNodeValue = function tulip_ColorVectorProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var size = _ColorVectorProperty_getNodeVectorSize(this.cppPointer, node.id);
  var colorArray = allocArrayInEmHeap(Uint8Array, size*4);
  _ColorVectorProperty_getNodeValue(this.cppPointer, node.id, colorArray.byteOffset);
  var ret = [];
  for (var i = 0 ; i < size ; ++i) {
    ret.push(tulip.Color(colorArray[4*i],colorArray[4*i+1],colorArray[4*i+2],colorArray[4*i+3]));
  }
  freeArrayInEmHeap(colorArray);
  return ret;
};
tulip.ColorVectorProperty.prototype.setNodeValue = function tulip_ColorVectorProperty_prototype_setNodeValue(node, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'array'], 2);
  checkArrayOfType(val, tulip.Color, 1);
  var colorArray = allocArrayInEmHeap(Uint8Array, val.length*4);
  for (var i = 0 ; i < val.length ; ++i) {
    colorArray[4*i] = val[i].r;
    colorArray[4*i+1] = val[i].g;
    colorArray[4*i+2] = val[i].b;
    colorArray[4*i+3] = val[i].a;
  }
  _ColorVectorProperty_setNodeValue(this.cppPointer, node.id, colorArray.byteOffset, val.length);
  freeArrayInEmHeap(colorArray);
};
tulip.ColorVectorProperty.prototype.getEdgeDefaultValue = function tulip_ColorVectorProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var size = _ColorVectorProperty_getEdgeDefaultVectorSize(this.cppPointer);
  var colorArray = allocArrayInEmHeap(Uint8Array, size*4);
  _ColorVectorProperty_getEdgeDefaultValue(this.cppPointer, colorArray.byteOffset);
  var ret = [];
  for (var i = 0 ; i < size ; ++i) {
    ret.push(tulip.Color(colorArray[4*i],colorArray[4*i+1],colorArray[4*i+2],colorArray[4*i+3]));
  }
  freeArrayInEmHeap(colorArray);
  return ret;
};
tulip.ColorVectorProperty.prototype.getEdgeValue = function tulip_ColorVectorProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var size = _ColorVectorProperty_getEdgeVectorSize(this.cppPointer, edge.id);
  var colorArray = allocArrayInEmHeap(Uint8Array, size*4);
  _ColorVectorProperty_getEdgeValue(this.cppPointer, edge.id, colorArray.byteOffset);
  var ret = [];
  for (var i = 0 ; i < size ; ++i) {
    ret.push(tulip.Color(colorArray[4*i],colorArray[4*i+1],colorArray[4*i+2],colorArray[4*i+3]));
  }
  freeArrayInEmHeap(colorArray);
  return ret;
};
tulip.ColorVectorProperty.prototype.setEdgeValue = function tulip_ColorVectorProperty_prototype_setEdgeValue(edge, val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'array'], 2);
  checkArrayOfType(val, tulip.Color, 1);
  var colorArray = allocArrayInEmHeap(Uint8Array, val.length*4);
  for (var i = 0 ; i < val.length ; ++i) {
    colorArray[4*i] = val[i].r;
    colorArray[4*i+1] = val[i].g;
    colorArray[4*i+2] = val[i].b;
    colorArray[4*i+3] = val[i].a;
  }
  _ColorVectorProperty_setEdgeValue(this.cppPointer, edge.id, colorArray.byteOffset, val.length);
  freeArrayInEmHeap(colorArray);
};
tulip.ColorVectorProperty.prototype.setAllNodeValue = function tulip_ColorVectorProperty_prototype_setAllNodeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, tulip.Color, 0);
  var colorArray = allocArrayInEmHeap(Uint8Array, val.length*4);
  for (var i = 0 ; i < val.length ; ++i) {
    colorArray[4*i] = val[i].r;
    colorArray[4*i+1] = val[i].g;
    colorArray[4*i+2] = val[i].b;
    colorArray[4*i+3] = val[i].a;
  }
  _ColorVectorProperty_setAllNodeValue(this.cppPointer, colorArray.byteOffset, val.length);
  freeArrayInEmHeap(colorArray);
};
tulip.ColorVectorProperty.prototype.setAllEdgeValue = function tulip_ColorVectorProperty_prototype_setAllEdgeValue(val) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(val, 'color', 0);
  var colorArray = allocArrayInEmHeap(Uint8Array, val.length*4);
  for (var i = 0 ; i < val.length ; ++i) {
    colorArray[4*i] = val[i].r;
    colorArray[4*i+1] = val[i].g;
    colorArray[4*i+2] = val[i].b;
    colorArray[4*i+3] = val[i].a;
  }
  _ColorVectorProperty_setAllEdgeValue(this.cppPointer, colorArray.byteOffset, val.length);
  freeArrayInEmHeap(colorArray);
};
// ==================================================================================================================

tulip.Vec3f = function tulip_Vec3f(x, y, z) {
  checkArgumentsTypes(arguments, ['number', 'number', 'number']);
  var newObject = createObject(tulip.Vec3f, this);
  newObject.x = 0;
  newObject.y = 0;
  newObject.z = 0;
  if (arguments.length == 1) {
    newObject.x = newObject.y = newObject.z = x;
  } else if (arguments.length == 2) {
    newObject.x = x;
    newObject.y = y;
  } else if (arguments.length == 3) {
    newObject.x = x;
    newObject.y = y;
    newObject.z = z;
  }
  return newObject;
};
tulip.Vec3f.prototype.add = function tulip_Vec3f_prototype_add() {
  var types = [];
  for (var i = 0 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 1);
  for (var i = 0 ; i < arguments.length ; ++i) {
    if (typeOf(arguments[i]) == 'number') {
      this.x += arguments[i];
      this.y += arguments[i];
      this.z += arguments[i];
    } else {
      this.x += arguments[i].x;
      this.y += arguments[i].y;
      this.z += arguments[i].z;
    }
  }
  return this;
};
tulip.Vec3f.add = function tulip_Vec3f_add() {
  var types = [];
  types.push(tulip.Vec3f);
  for (var i = 1 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 2);
  var p = arguments[0];
  for (var i = 1 ; i < arguments.length ; ++i) {
    if (typeOf(arguments[i]) == 'number') {
      p.x += arguments[i];
      p.y += arguments[i];
      p.z += arguments[i];
    } else {
      p.x += arguments[i].x;
      p.y += arguments[i].y;
      p.z += arguments[i].z;
    }
  }
  return p;
};
tulip.Vec3f.prototype.sub = function tulip_Vec3f_prototype_sub() {
  var types = [];
  for (var i = 0 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 1);
  for (var i = 0 ; i < arguments.length ; ++i) {
    this.x -= arguments[i].x;
    this.y -= arguments[i].y;
    this.z -= arguments[i].z;
  }
  return this;
};
tulip.Vec3f.sub = function tulip_Vec3f_sub() {
  var types = [];
  types.push(tulip.Vec3f);
  for (var i = 1 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 2);
  var p = arguments[0];
  for (var i = 1 ; i < arguments.length ; ++i) {
    if (typeOf(arguments[i]) == 'number') {
      p.x -= arguments[i];
      p.y -= arguments[i];
      p.z -= arguments[i];
    } else {
      p.x -= arguments[i].x;
      p.y -= arguments[i].y;
      p.z -= arguments[i].z;
    }
  }
  return p;
};
tulip.Vec3f.prototype.mul = function tulip_Vec3f_prototype_mul() {
  var types = [];
  for (var i = 0 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 1);
  for (var i = 0 ; i < arguments.length ; ++i) {
    if (typeOf(arguments[i]) == 'number') {
      this.x *= arguments[i];
      this.y *= arguments[i];
      this.z *= arguments[i];
    } else {
      this.x *= arguments[i].x;
      this.y *= arguments[i].y;
      this.z *= arguments[i].z;
    }
  }
  return this;
};
tulip.Vec3f.mul = function tulip_Vec3f_mul() {
  var types = [];
  types.push(tulip.Vec3f);
  for (var i = 1 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 2);
  var p = arguments[0];
  for (var i = 1 ; i < arguments.length ; ++i) {
    if (typeOf(arguments[i]) == 'number') {
      p.x *= arguments[i];
      p.y *= arguments[i];
      p.z *= arguments[i];
    } else {
      p.x *= arguments[i].x;
      p.y *= arguments[i].y;
      p.z *= arguments[i].z;
    }
  }
  return p;
};
tulip.Vec3f.prototype.div = function tulip_Vec3f_prototype_div() {
  var types = [];
  for (var i = 0 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 1);
  for (var i = 0 ; i < arguments.length ; ++i) {
    if (typeOf(arguments[i]) == 'number') {
      this.x /= arguments[i];
      this.y /= arguments[i];
      this.z /= arguments[i];
    } else {
      this.x /= arguments[i].x;
      this.y /= arguments[i].y;
      this.z /= arguments[i].z;
    }
  }
  return this;
};
tulip.Vec3f.div = function tulip_Vec3f_div() {
  var types = [];
  types.push(tulip.Vec3f);
  for (var i = 1 ; i < arguments.length ; ++i) {
    types.push(['number', tulip.Vec3f]);
  }
  checkArgumentsTypes(arguments, types, 2);
  var p = arguments[0];
  for (var i = 1 ; i < arguments.length ; ++i) {
    p.x *= arguments[i].x;
    p.y *= arguments[i].y;
    p.z *= arguments[i].z;
  }
  return p;
};
tulip.Vec3f.prototype.norm = function tulip_Vec3f_prototype_norm() {
  return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
};
tulip.Vec3f.prototype.normalize = function tulip_Vec3f_prototype_normalize() {
  var n = this.norm();
  if (n != 0) {
    this.div(n);
  }
};
tulip.Vec3f.prototype.dist = function tulip_Vec3f_prototype_dist(c) {
  checkArgumentsTypes(arguments, [tulip.Vec3f]);
  return tulip.Vec3f.dist(this, c);
};
tulip.Vec3f.dist = function tulip_Vec3f_dist(c1, c2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f, tulip.Vec3f]);
  return tulip.Vec3f.sub(c1, c2).norm();
};
tulip.Vec3f.min = function tulip_Vec3f_min() {
  var types = [];
  for (var i = 0 ; i < arguments.length ; ++i) {
    types.push(tulip.Vec3f);
  }
  checkArgumentsTypes(arguments, types, 2);
  var ret = arguments[0];
  for (var i = 1 ; i < arguments.length ; ++i) {
    ret.x = Math.min(ret.x, arguments[i].x);
    ret.y = Math.min(ret.y, arguments[i].y);
    ret.z = Math.min(ret.z, arguments[i].z);
  }
  return ret;
};
tulip.Vec3f.max = function tulip_Vec3f_max() {
  var types = [];
  for (var i = 0 ; i < arguments.length ; ++i) {
    types.push(tulip.Vec3f);
  }
  checkArgumentsTypes(arguments, types, 2);
  var ret = arguments[0];
  for (var i = 1 ; i < arguments.length ; ++i) {
    ret.x = Math.max(ret.x, arguments[i].x);
    ret.y = Math.max(ret.y, arguments[i].y);
    ret.z = Math.max(ret.z, arguments[i].z);
  }
  return ret;
};
tulip.Vec3f.lt = function tulip_Vec3f_lt(v1, v2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f, tulip.Vec3f], 2);
  return v1.x < v2.x && v1.y < v2.y && v1.z < v2.z;
};
tulip.Vec3f.prototype.lt = function tulip_Vec3f_prototype_lt(v) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 1);
  return tulip.Vec3f.lt(this, v);
};
tulip.Vec3f.leq = function tulip_Vec3f_leq(v1, v2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f, tulip.Vec3f], 2);
  return v1.x <= v2.x && v1.y <= v2.y && v1.z <= v2.z;
};
tulip.Vec3f.prototype.leq = function tulip_Vec3f_prototype_leq(v) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 1);
  return tulip.Vec3f.leq(this, v);
};
tulip.Vec3f.gt = function tulip_Vec3f_gt(v1, v2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f, tulip.Vec3f], 2);
  return v1.x > v2.x && v1.y > v2.y && v1.z > v2.z;
};
tulip.Vec3f.prototype.gt = function tulip_Vec3f_prototype_gt(v) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 1);
  return tulip.Vec3f.gt(this, v);
};
tulip.Vec3f.geq = function tulip_Vec3f_geq(v1, v2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f, tulip.Vec3f], 2);
  return v1.x >= v2.x && v1.y >= v2.y && v1.z >= v2.z;
};
tulip.Vec3f.prototype.geq = function tulip_Vec3f_prototype_geq(v) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 1);
  return tulip.Vec3f.geq(this, v);
};
tulip.Vec3f.dot = function tulip_Vec3f_dot(v1, v2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 2);
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
tulip.Vec3f.prototype.dot = function tulip_Vec3f_prototype_dot(v) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 1);
  return tulip.Vec3f.dot(this, v);
};
tulip.Vec3f.cross = function tulip_Vec3f_cross(v1, v2) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 2);
  var x = v1.y * v2.z - v1.z * v2.y;
  var y = v1.z * v2.x - v1.x * v2.z;
  var z = v1.x * v2.y - v1.y * v2.x;
  return tulip.Vec3f(x, y, z);
};
tulip.Vec3f.prototype.cross = function tulip_Vec3f_prototype_cross(v) {
  checkArgumentsTypes(arguments, [tulip.Vec3f], 1);
  return tulip.Vec3f.cross(this, v);
};
tulip.Vec3f.prototype.getX = function tulip_Vec3f_prototype_getX() {
  return this.x;
};
tulip.Vec3f.prototype.getY = function tulip_Vec3f_prototype_getY() {
  return this.y;
};
tulip.Vec3f.prototype.getZ = function tulip_Vec3f_prototype_getZ() {
  return this.z;
};
tulip.Vec3f.prototype.setX = function tulip_Vec3f_prototype_setX(x) {
  checkArgumentsTypes(arguments, ['number'], 1);
  this.x = x;
};
tulip.Vec3f.prototype.setY = function tulip_Vec3f_prototype_setY(y) {
  checkArgumentsTypes(arguments, ['number'], 1);
  this.y = y;
};
tulip.Vec3f.prototype.setZ = function tulip_Vec3f_prototype_setZ(z) {
  checkArgumentsTypes(arguments, ['number'], 1);
  this.z = z;
};
tulip.Vec3f.prototype.getWidth = function tulip_Vec3f_prototype_getWidth() {
  return this.x;
};
tulip.Vec3f.prototype.getHeight = function tulip_Vec3f_prototype_getHeight() {
  return this.y;
};
tulip.Vec3f.prototype.getDepth = function tulip_Vec3f_prototype_getDepth() {
  return this.z;
};
tulip.Vec3f.prototype.setWidth = function tulip_Vec3f_prototype_setWidth(w) {
  checkArgumentsTypes(arguments, ['number'], 1);
  this.x = w;
};
tulip.Vec3f.prototype.setHeight = function tulip_Vec3f_prototype_setHeight(h) {
  checkArgumentsTypes(arguments, ['number'], 1);
  this.y = h;
};
tulip.Vec3f.prototype.setDepth = function tulip_Vec3f_prototype_setDepth(d) {
  checkArgumentsTypes(arguments, ['number'], 1);
  this.z = d;
};


tulip.Coord = tulip.Vec3f;
tulip.Size = tulip.Vec3f;

// ==================================================================================================================

var _createLayoutProperty = Module.cwrap('createLayoutProperty', 'number', ['number', 'string']);
var _LayoutProperty_setNodeValue = Module.cwrap('LayoutProperty_setNodeValue', null, ['number', 'number', 'number', 'number', 'number']);
var _LayoutProperty_setAllNodeValue = Module.cwrap('LayoutProperty_setAllNodeValue', null, ['number', 'number', 'number', 'number']);
var _LayoutProperty_getNodeDefaultValue = Module.cwrap('LayoutProperty_getNodeDefaultValue', null, ['number', 'number']);
var _LayoutProperty_getNodeValue = Module.cwrap('LayoutProperty_getNodeValue', null, ['number', 'number', 'number']);
var _LayoutProperty_getEdgeDefaultNumberOfBends = Module.cwrap('LayoutProperty_getEdgeDefaultNumberOfBends', 'number', ['number']);
var _LayoutProperty_getEdgeDefaultValue = Module.cwrap('LayoutProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _LayoutProperty_getEdgeNumberOfBends = Module.cwrap('LayoutProperty_getEdgeNumberOfBends', 'number', ['number', 'number']);
var _LayoutProperty_getEdgeValue = Module.cwrap('LayoutProperty_getEdgeValue', null, ['number', 'number', 'number']);
var _LayoutProperty_setEdgeValue = Module.cwrap('LayoutProperty_setEdgeValue', null, ['number', 'number', 'number', 'number']);
var _LayoutProperty_setAllEdgeValue = Module.cwrap('LayoutProperty_setAllEdgeValue', null, ['number', 'number', 'number']);
var _LayoutProperty_getMin = Module.cwrap('LayoutProperty_getMin', null, ['number', 'number', 'number']);
var _LayoutProperty_getMax = Module.cwrap('LayoutProperty_getMax', null, ['number', 'number', 'number']);
var _LayoutProperty_translate = Module.cwrap('LayoutProperty_translate', null, ['number', 'number', 'number', 'number', 'number']);
var _LayoutProperty_scale = Module.cwrap('LayoutProperty_scale', null, ['number', 'number', 'number', 'number', 'number']);
var _LayoutProperty_rotateX = Module.cwrap('LayoutProperty_rotateX', null, ['number', 'number', 'number']);
var _LayoutProperty_rotateY = Module.cwrap('LayoutProperty_rotateY', null, ['number', 'number', 'number']);
var _LayoutProperty_rotateZ = Module.cwrap('LayoutProperty_rotateZ', null, ['number', 'number', 'number']);
var _LayoutProperty_center = Module.cwrap('LayoutProperty_center', null, ['number', 'number']);
var _LayoutProperty_center2 = Module.cwrap('LayoutProperty_center2', null, ['number', 'number', 'number', 'number', 'number']);
var _LayoutProperty_normalize = Module.cwrap('LayoutProperty_normalize', null, ['number', 'number']);
var _LayoutProperty_perfectAspectRatio = Module.cwrap('LayoutProperty_perfectAspectRatio', null, ['number']);

tulip.LayoutProperty = function tulip_LayoutProperty() {
  var newObject = createObject(tulip.LayoutProperty, this);
  if (tulip_LayoutProperty.caller == null || tulip_LayoutProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createLayoutProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::LayoutProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.LayoutProperty.inheritsFrom(tulip.PropertyInterface);
tulip.LayoutProperty.prototype.getNodeDefaultValue = function tulip_LayoutProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _LayoutProperty_getNodeDefaultValue(this.cppPointer, floatArray.byteOffset);
  var ret = tulip.Coord(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.LayoutProperty.prototype.getNodeValue = function tulip_LayoutProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _LayoutProperty_getNodeValue(this.cppPointer, node.id, floatArray.byteOffset);
  var ret = tulip.Coord(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.LayoutProperty.prototype.setNodeValue = function tulip_LayoutProperty_prototype_setNodeValue(node, coord) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, tulip.Coord], 2);
  _LayoutProperty_setNodeValue(this.cppPointer, node.id, coord.x, coord.y, coord.z);
};
tulip.LayoutProperty.prototype.setAllNodeValue = function tulip_LayoutProperty_prototype_setAllNodeValue(coord) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Coord], 1);
  _LayoutProperty_setAllNodeValue(this.cppPointer, coord.x, coord.y, coord.z);
};
tulip.LayoutProperty.prototype.getEdgeDefaultValue = function tulip_LayoutProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var nbBends = _LayoutProperty_getEdgeDefaultNumberOfBends(this.cppPointer);
  var floatArray = allocArrayInEmHeap(Float32Array, nbBends*3);
  _LayoutProperty_getEdgeDefaultValue(this.cppPointer, floatArray.byteOffset);
  var ret = [];
  for (var i = 0 ; i < nbBends ; ++i) {
    ret.push(tulip.Coord(floatArray[3*i], floatArray[3*i+1], floatArray[3*i+2]));
  }
  freeArrayInEmHeap(floatArray);
  return ret;
};

tulip.LayoutProperty.prototype.getEdgeValue = function tulip_LayoutProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var nbBends = _LayoutProperty_getEdgeNumberOfBends(this.cppPointer, edge.id);
  var floatArray = allocArrayInEmHeap(Float32Array, nbBends*3);
  _LayoutProperty_getEdgeValue(this.cppPointer, edge.id, floatArray.byteOffset);
  var ret = [];
  for (var i = 0 ; i < nbBends ; ++i) {
    ret.push(tulip.Coord(floatArray[3*i], floatArray[3*i+1], floatArray[3*i+2]));
  }
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.LayoutProperty.prototype.setEdgeValue = function tulip_LayoutProperty_prototype_setEdgeValue(edge, bends) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'array']);
  checkArrayOfType(bends, tulip.Coord, 1);
  if (bends.length == 0) return;
  var floatArray = allocArrayInEmHeap(Float32Array, bends.length*3);
  for (var i = 0 ; i < bends.length ; ++i) {
    floatArray[3*i] = bends[i].x;
    floatArray[3*i+1] = bends[i].y;
    floatArray[3*i+2] = bends[i].z;
  }
  _LayoutProperty_setEdgeValue(this.cppPointer, edge.id, floatArray.byteOffset, bends.length);
  freeArrayInEmHeap(floatArray);
};
tulip.LayoutProperty.prototype.setAllEdgeValue = function tulip_LayoutProperty_prototype_setAllEdgeValue(bends) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array']);
  if (bends.length == 0) return;
  checkArrayOfType(bends, tulip.Coord, 0);
  var floatArray = allocArrayInEmHeap(Float32Array, bends.length*3);
  for (var i = 0 ; i < bends.length ; ++i) {
    floatArray[3*i] = bends[i].x;
    floatArray[3*i+1] = bends[i].y;
    floatArray[3*i+2] = bends[i].z;
  }
  _LayoutProperty_setAllEdgeValue(this.cppPointer, floatArray.byteOffset, bends.length);
  freeArrayInEmHeap(floatArray);
};
tulip.LayoutProperty.prototype.getMin = function tulip_LayoutProperty_prototype_getMin(subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph]);
  var sgPointer = 0;
  if (arguments.length == 1) {
    sgPointer = subgraph.cppPointer;
  }
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _LayoutProperty_getMin(this.cppPointer, sgPointer, floatArray.byteOffset);
  var ret = tulip.Coord(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.LayoutProperty.prototype.getMax = function tulip_LayoutProperty_prototype_getMax(subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph]);
  var sgPointer = 0;
  if (arguments.length == 1) {
    sgPointer = subgraph.cppPointer;
  }
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _LayoutProperty_getMax(this.cppPointer, sgPointer, floatArray.byteOffset);
  var ret = tulip.Coord(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.LayoutProperty.prototype.translate = function tulip_LayoutProperty_prototype_translate(move, subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Coord, tulip.Graph], 1);
  var sgPointer = 0;
  if (arguments.length == 2) {
    sgPointer = subgraph.cppPointer;
  }
  _LayoutProperty_translate(this.cppPointer, move.x, move.y, move.z, sgPointer);
};
tulip.LayoutProperty.prototype.scale = function tulip_LayoutProperty_prototype_scale(scaleFactors, subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Coord, tulip.Graph], 1);
  var sgPointer = 0;
  if (arguments.length == 2) {
    sgPointer = subgraph.cppPointer;
  }
  _LayoutProperty_scale(this.cppPointer, scaleFactors.x, scaleFactors.y, scaleFactors.z, sgPointer);
};
tulip.LayoutProperty.prototype.rotateX = function tulip_LayoutProperty_prototype_rotateX(alpha, subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number', tulip.Graph], 1);
  var sgPointer = 0;
  if (arguments.length == 2) {
    sgPointer = subgraph.cppPointer;
  }
  _LayoutProperty_rotateX(this.cppPointer, alpha, sgPointer);
};
tulip.LayoutProperty.prototype.rotateY = function tulip_LayoutProperty_prototype_rotateY(alpha, subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number', tulip.Graph], 1);
  var sgPointer = 0;
  if (arguments.length == 2) {
    sgPointer = subgraph.cppPointer;
  }
  _LayoutProperty_rotateY(this.cppPointer, alpha, sgPointer);
};
tulip.LayoutProperty.prototype.rotateZ = function tulip_LayoutProperty_prototype_rotateZ(alpha, subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number', tulip.Graph], 1);
  var sgPointer = 0;
  if (arguments.length == 2) {
    sgPointer = subgraph.cppPointer;
  }
  _LayoutProperty_rotateZ(this.cppPointer, alpha, sgPointer);
};
tulip.LayoutProperty.prototype.center = function tulip_LayoutProperty_prototype_center() {
  checkWrappedCppPointer(this.cppPointer);
  if (arguments.length == 0) {
    _LayoutProperty_center(this.cppPointer, 0);
  } else if (arguments.length == 1) {
    checkArgumentsTypes(arguments, [[tulip.Coord, tulip.Graph]]);
    if (arguments[0] instanceof tulip.Coord) {
      _LayoutProperty_center2(this.cppPointer, arguments[0].x, arguments[0].y, arguments[0].z, 0);
    } else {
      _LayoutProperty_center(this.cppPointer, arguments[0].cppPointer);
    }
  } else {
    checkArgumentsTypes(arguments, [tulip.Coord, tulip.Graph], 2);
    _LayoutProperty_center2(this.cppPointer, arguments[0].x, arguments[0].y, arguments[0].z, arguments[1].cppPointer);
  }
};
tulip.LayoutProperty.prototype.normalize = function tulip_LayoutProperty_prototype_normalize(subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  var sgPointer = 0;
  checkArgumentsTypes(arguments, [tulip.Graph]);
  if (arguments.length == 1) {
    sgPointer = subgraph.cppPointer;
  }
  _LayoutProperty_normalize(this.cppPointer, sgPointer);
};
tulip.LayoutProperty.prototype.perfectAspectRatio = function tulip_LayoutProperty_prototype_perfectAspectRatio() {
  checkWrappedCppPointer(this.cppPointer);
  _LayoutProperty_perfectAspectRatio(this.cppPointer);
};
// ==================================================================================================================

var _createSizeProperty = Module.cwrap('createSizeProperty', 'number', ['number', 'string']);
var _SizeProperty_setNodeValue = Module.cwrap('SizeProperty_setNodeValue', null, ['number', 'number', 'number', 'number', 'number']);
var _SizeProperty_setAllNodeValue = Module.cwrap('SizeProperty_setAllNodeValue', null, ['number', 'number', 'number', 'number']);
var _SizeProperty_getNodeDefaultValue = Module.cwrap('SizeProperty_getNodeDefaultValue', null, ['number', 'number']);
var _SizeProperty_getNodeValue = Module.cwrap('SizeProperty_getNodeValue', null, ['number', 'number', 'number']);
var _SizeProperty_getEdgeDefaultValue = Module.cwrap('SizeProperty_getEdgeDefaultValue', null, ['number', 'number']);
var _SizeProperty_getEdgeValue = Module.cwrap('SizeProperty_getEdgeValue', null, ['number', 'number', 'number']);
var _SizeProperty_setEdgeValue = Module.cwrap('SizeProperty_setAllEdgeValue', null, ['number', 'number', 'number', 'number', 'number']);
var _SizeProperty_setAllEdgeValue = Module.cwrap('SizeProperty_setAllEdgeValue', null, ['number', 'number', 'number', 'number']);
var _SizeProperty_scale = Module.cwrap('SizeProperty_scale', null, ['number', 'number', 'number', 'number', 'number']);
var _SizeProperty_getMin = Module.cwrap('SizeProperty_getMin', null, ['number', 'number', 'number']);
var _SizeProperty_getMax = Module.cwrap('SizeProperty_getMax', null, ['number', 'number', 'number']);

tulip.SizeProperty = function tulip_SizeProperty() {
  var newObject = createObject(tulip.SizeProperty, this);
  if (tulip_SizeProperty.caller == null || tulip_SizeProperty.caller.name != 'createObject') {
    var cppPointer = 0;
    var graphManaged = false;
    if (arguments.length == 1 && typeOf(arguments[0]) == 'number') {
      cppPointer = arguments[0];
      graphManaged = true;
    } else {
      checkArgumentsTypes(arguments, [tulip.Graph, 'string'], 1);
      var propName = '';
      if (arguments.length > 1) propName = arguments[1];
      cppPointer = _createSizeProperty(arguments[0].cppPointer, propName);
    }
    tulip.PropertyInterface.call(newObject, cppPointer, graphManaged);
    newObject.setWrappedTypename('tlp::SizeProperty');
  }
  return createPropertyProxyIfAvailable(newObject);
};
tulip.SizeProperty.inheritsFrom(tulip.PropertyInterface);
tulip.SizeProperty.prototype.getNodeDefaultValue = function tulip_SizeProperty_prototype_getNodeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _SizeProperty_getNodeDefaultValue(this.cppPointer, floatArray.byteOffset);
  var ret = tulip.Size(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.SizeProperty.prototype.getNodeValue = function tulip_SizeProperty_prototype_getNodeValue(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _SizeProperty_getNodeValue(this.cppPointer, node.id, floatArray.byteOffset);
  var ret = tulip.Size(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.SizeProperty.prototype.setNodeValue = function tulip_SizeProperty_prototype_setNodeValue(node, size) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, tulip.Size]);
  _SizeProperty_setNodeValue(this.cppPointer, node.id, size.getWidth(), size.getHeight(), size.getDepth());
};
tulip.SizeProperty.prototype.setAllNodeValue = function tulip_SizeProperty_prototype_setAllNodeValue(size) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Size]);
  _SizeProperty_setAllNodeValue(this.cppPointer, size.getWidth(), size.getHeight(), size.getDepth());
};
tulip.SizeProperty.prototype.getEdgeDefaultValue = function tulip_SizeProperty_prototype_getEdgeDefaultValue() {
  checkWrappedCppPointer(this.cppPointer);
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _SizeProperty_getEdgeDefaultValue(this.cppPointer, floatArray.byteOffset);
  var ret = tulip.Size(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.SizeProperty.prototype.getEdgeValue = function tulip_SizeProperty_prototype_getEdgeValue(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _SizeProperty_getEdgeValue(this.cppPointer, edge.id, floatArray.byteOffset);
  var ret = tulip.Size(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.SizeProperty.prototype.setEdgeValue = function tulip_SizeProperty_prototype_setEdgeValue(edge, size) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, tulip.Size]);
  _SizeProperty_setEdgeValue(this.cppPointer, edge.id, size.getWidth(), size.getHeight(), size.getDepth());
};
tulip.SizeProperty.prototype.setAllEdgeValue = function tulip_SizeProperty_prototype_setAllEdgeValue(size) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Size]);
  _SizeProperty_setAllEdgeValue(this.cppPointer, size.getWidth(), size.getHeight(), size.getDepth());
};
tulip.SizeProperty.prototype.scale = function tulip_SizeProperty_prototype_scale(sizeFactor, subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Size, tulip.Graph], 1);
  var sgPointer = 0;
  if (arguments.length > 1) sgPointer = subgraph.cppPointer;
  _SizeProperty_scale(this.cppPointer, sizeFactor.getWidth(), sizeFactor.getHeight(), sizeFactor.getDepth(), sgPointer);
};
tulip.SizeProperty.prototype.getMin = function tulip_SizeProperty_prototype_getMin(subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph]);
  var sgPointer= 0;
  if (arguments.length == 1) {
    sgPointer = subgraph.cppPointer;
  }
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _SizeProperty_getMin(this.cppPointer, sgPointer, floatArray.byteOffset);
  var ret = tulip.Size(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};
tulip.SizeProperty.prototype.getMax = function tulip_SizeProperty_prototype_getMax(subgraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph]);
  var sgPointer= 0;
  if (arguments.length == 1) {
    sgPointer = subgraph.cppPointer;
  }
  var floatArray = allocArrayInEmHeap(Float32Array, 3);
  _SizeProperty_getMax(this.cppPointer, sgPointer, floatArray.byteOffset);
  var ret = tulip.Size(floatArray[0], floatArray[1], floatArray[2]);
  freeArrayInEmHeap(floatArray);
  return ret;
};

// ==================================================================================================================

tulip.BoundingBox = function tulip_BoundingBox() {
  var newObject = createObject(tulip.BoundingBox, this);
  if (arguments.length == 0) {
    newObject.min = tulip.Coord(1,1,1);
    newObject.max = tulip.Coord(-1,-1,-1);
  } else {
    checkArgumentsTypes(arguments, [tulip.Coord, tulip.Coord], 2);
    newObject.min = arguments[0];
    newObject.max = arguments[1];
  }
  return newObject;
};
tulip.BoundingBox.prototype.isValid = function tulip_BoundingBox_prototype_isValid() {
  return this.min.x <= this.max.x && this.min.y <= this.max.y && this.min.z <= this.min.z;
};
tulip.BoundingBox.prototype.center = function tulip_BoundingBox_prototype_center() {
  return tulip.Coord.add(this.min, this.max).div(2);
};
tulip.BoundingBox.prototype.width = function tulip_BoundingBox_prototype_width() {
  return this.max.x - this.min.x;
};
tulip.BoundingBox.prototype.height = function tulip_BoundingBox_prototype_height() {
  return this.max.y - this.min.y;
};
tulip.BoundingBox.prototype.depth = function tulip_BoundingBox_prototype_depth() {
  return this.max.z - this.min.z;
};
tulip.BoundingBox.prototype.expand = function tulip_BoundingBox_prototype_depth(coord) {
  checkArgumentsTypes(arguments, [tulip.Coord], 1);
  if (!this.isValid()) {
    this.min = arguments[0];
    this.max = arguments[0];
  }
  this.min = tulip.Coord.min.apply(null, [this.min].concat(Array.slice(arguments)));
  this.max = tulip.Coord.max.apply(null, [this.max].concat(Array.slice(arguments)));
};
tulip.BoundingBox.prototype.translate = function tulip_BoundingBox_prototype_translate(vec) {
  checkArgumentsTypes(arguments, [tulip.Coord], 1);
  this.min.add(vec);
  this.max.add(vec);
};
tulip.BoundingBox.prototype.scale = function tulip_BoundingBox_prototype_scale(vec) {
  checkArgumentsTypes(arguments, [tulip.Coord], 1);
  this.min.mul(vec);
  this.max.mul(vec);
};
tulip.BoundingBox.prototype.contains = function tulip_BoundingBox_prototype_contains(obj) {
  checkArgumentsTypes(arguments, [[tulip.Coord, tulip.BoundingBox]], 1);
  if (obj instanceof tulip.Coord) {
    if (this.isValid()) {
      return coord.x >= this.min.x && coord.y >= this.min.y && coord.z >= this.min.z && coord.x <= this.max.x && coord.y <= this.max.y && coord.z <= this.max.z;
    } else {
      return false;
    }
  } else {
    if (this.isValid() && obj.isValid()) {
      return this.contains(obj.min) && this.contains(obj.max);
    } else {
      return false;
    }
  }
};
tulip.BoundingBox.prototype.intersect = function tulip_BoundingBox_prototype_intersect(bb) {
  checkArgumentsTypes(arguments, [tulip.BoundingBox], 1);
  if (!this.isValid() || !bb.isValid()) {
    return false;
  }
  if (this.max.x < bb.min.x) return false;
  if (bb.max.x < this.min.x) return false;
  if (this.max.y < bb.min.y) return false;
  if (bb.max.y < this.min.y) return false;
  if (this.max.z < bb.min.z) return false;
  if (bb.max.z < this.min.z) return false;
  return true;
};


// ==================================================================================================================
/**
* This is the description for the tulip.node class.
*
* @class Node
* @constructor
*/
tulip.Node = function tulip_Node(id) {
  checkArgumentsTypes(arguments, ['number']);
  var newObject = createObject(tulip.Node, this);
  if (arguments.length == 0) {
    newObject.id = UINT_MAX;
  } else {
    newObject.id = id;
  }
  return newObject;
};
tulip.Node.prototype.isValid = function() {
  return this.id != UINT_MAX;
};
tulip.Node.prototype.toString = function() {
  return '[Node ' + this.id + ']';
};

// ==================================================================================================================
/**
* This is the description for the tulip.edge class.
*
* @class Edge
* @constructor
*/
tulip.Edge = function tulip_Edge(id) {
  checkArgumentsTypes(arguments, ['number']);
  var newObject = createObject(tulip.Edge, this);
  if (arguments.length == 0) {
    newObject.id = UINT_MAX;
  } else {
    newObject.id = id;
  }
  return newObject;
};
tulip.Edge.prototype.isValid = function() {
  return this.id != UINT_MAX;
};
tulip.Edge.prototype.toString = function() {
  return '[Edge ' + this.id + ']';
};

// ==================================================================================================================

var _getJSONGraph = Module.cwrap('getJSONGraph', 'string', ['number']);
var _loadGraph = Module.cwrap('loadGraph', 'number', ['string', 'number']);
var _saveGraph = Module.cwrap('saveGraph', 'number', ['number', 'string', 'number']);
var _getDefaultAlgorithmParametersJSON = Module.cwrap('getDefaultAlgorithmParametersJSON', 'string', ['string', 'number']);





tulip.loadGraph = function tulip_loadGraph(filename, notifyProgress) {
  checkArgumentsTypes(arguments, ['string', 'boolean']);
  var graphPointer = _loadGraph(filename, notifyProgress);
  if (graphPointer) {
    return tulip.Graph(graphPointer);
  } else {
    return null;
  }
};

tulip.loadGraphAsync = function tulip_loadGraphAsync(graphFileUrl, graphLoadedCallback) {
  checkArgumentsTypes(arguments, ['string', 'function']);
  var graphReq = new XMLHttpRequest();
  graphReq.open('GET', graphFileUrl, true);
  graphReq.responseType = 'arraybuffer';
  graphReq.onload = function (oEvent) {
    var arrayBuffer = graphReq.response;
    var paths = graphFileUrl.split('/');

    var file = FS.findObject(graphFileUrl);
    if (!file) {
      var filePath = '/';
      for (var i = 0; i < paths.length - 1; ++i) {
        filePath += paths[i];
        filePath += '/';
      }
      FS.createPath('/', filePath, true, true);
      FS.createFile('/', graphFileUrl, {}, true, true);
    }
    FS.writeFile(graphFileUrl, new Uint8Array(arrayBuffer), {'encoding' : 'binary'});
    var graph = tulip.loadGraph(graphFileUrl, false);
    FS.unlink(graphFileUrl);
    if (graphLoadedCallback) {
      graphLoadedCallback(graph);
    }
  };
  graphReq.send(null);
};

tulip.saveGraph = function tulip_saveGraph(graph, filename, notifyProgress) {
  checkArgumentsTypes(arguments, [tulip.Graph, 'string']);
  return _saveGraph(graph.cppPointer, filename, notifyProgress) > 0;
};

tulip.getDefaultAlgorithmParameters = function tulip_getDefaultAlgorithmParameters(algoName, graph) {
  checkArgumentsTypes(arguments, ['string', tulip.Graph], 1);
  var gPointer = 0;
  if (graph) {
    gPointer = graph.cppPointer;
  }
  if (!tulip.pluginExists(algoName)) {
    console.log('Error : no Tulip algorithm named \'' + algoName + '\'');
    return {};
  }
  var params = JSON.parse(_getDefaultAlgorithmParametersJSON(algoName, gPointer));
  for (var property in params) {
    if (params.hasOwnProperty(property)) {
      if (typeOf(params[property]) == 'object') {
        if (params[property].type == 'property') {
          params[property] = graph.getProperty(params[property].name);
        }
      }
    }
  }
  return params;
};

// ==================================================================================================================

var _numberOfPlugins = Module.cwrap('numberOfPlugins', 'number', []);
var _pluginsNamesLengths = Module.cwrap('pluginsNamesLengths', 'number', ['number']);
var _getPluginsList = Module.cwrap('getPluginsList', null, ['number']);
var _numberOfAlgorithms = Module.cwrap('numberOfAlgorithms', 'number', []);
var _algorithmsNamesLengths = Module.cwrap('algorithmsNamesLengths', 'number', ['number']);
var _getAlgorithmPluginsList = Module.cwrap('getAlgorithmPluginsList', null, ['number']);
var _numberOfBooleanAlgorithms = Module.cwrap('numberOfBooleanAlgorithms', 'number', []);
var _booleanAlgorithmsNamesLengths = Module.cwrap('booleanAlgorithmsNamesLengths', 'number', ['number']);
var _getBooleanAlgorithmPluginsList = Module.cwrap('getBooleanAlgorithmPluginsList', null, ['number']);
var _numberOfColorAlgorithms = Module.cwrap('numberOfColorAlgorithms', 'number', []);
var _colorAlgorithmsNamesLengths = Module.cwrap('colorAlgorithmsNamesLengths', 'number', ['number']);
var _getColorAlgorithmPluginsList = Module.cwrap('getColorAlgorithmPluginsList', null, ['number']);
var _numberOfDoubleAlgorithms = Module.cwrap('numberOfDoubleAlgorithms', 'number', []);
var _doubleAlgorithmsNamesLengths = Module.cwrap('doubleAlgorithmsNamesLengths', 'number', ['number']);
var _getDoubleAlgorithmPluginsList = Module.cwrap('getDoubleAlgorithmPluginsList', null, ['number']);
var _numberOfIntegerAlgorithms = Module.cwrap('numberOfIntegerAlgorithms', 'number', []);
var _integerAlgorithmsNamesLengths = Module.cwrap('integerAlgorithmsNamesLengths', 'number', ['number']);
var _getIntegerAlgorithmPluginsList = Module.cwrap('getIntegerAlgorithmPluginsList', null, ['number']);
var _numberOfLayoutAlgorithms = Module.cwrap('numberOfLayoutAlgorithms', 'number', []);
var _layoutAlgorithmsNamesLengths = Module.cwrap('layoutAlgorithmsNamesLengths', 'number', ['number']);
var _getLayoutAlgorithmPluginsList = Module.cwrap('getLayoutAlgorithmPluginsList', null, ['number']);
var _numberOfSizeAlgorithms = Module.cwrap('numberOfSizeAlgorithms', 'number', []);
var _sizeAlgorithmsNamesLengths = Module.cwrap('sizeAlgorithmsNamesLengths', 'number', ['number']);
var _getSizeAlgorithmPluginsList = Module.cwrap('getSizeAlgorithmPluginsList', null, ['number']);
var _numberOfStringAlgorithms = Module.cwrap('numberOfStringAlgorithms', 'number', []);
var _stringAlgorithmsNamesLengths = Module.cwrap('stringAlgorithmsNamesLengths', 'number', ['number']);
var _getStringAlgorithmPluginsList = Module.cwrap('getStringAlgorithmPluginsList', null, ['number']);
var _numberOfImportPlugins = Module.cwrap('numberOfImportPlugins', 'number', []);
var _importPluginsNamesLengths = Module.cwrap('importPluginsNamesLengths', 'number', ['number']);
var _getImportPluginsList = Module.cwrap('getImportPluginsList', null, ['number']);
var _algorithmExists = Module.cwrap('algorithmExists', 'number', ['string']);
var _propertyAlgorithmExists = Module.cwrap('propertyAlgorithmExists', 'number', ['string']);
var _booleanAlgorithmExists = Module.cwrap('booleanAlgorithmExists', 'number', ['string']);
var _colorAlgorithmExists = Module.cwrap('colorAlgorithmExists', 'number', ['string']);
var _doubleAlgorithmExists = Module.cwrap('doubleAlgorithmExists', 'number', ['string']);
var _integerAlgorithmExists = Module.cwrap('integerAlgorithmExists', 'number', ['string']);
var _layoutAlgorithmExists = Module.cwrap('layoutAlgorithmExists', 'number', ['string']);
var _stringAlgorithmExists = Module.cwrap('stringAlgorithmExists', 'number', ['string']);
var _sizeAlgorithmExists = Module.cwrap('sizeAlgorithmExists', 'number', ['string']);
var _importPluginExists = Module.cwrap('importPluginExists', 'number', ['string']);

var _pluginsListImpl = function(numberOfPlugins, pluginsNamesLengths, getPluginsList) {
  var nbPlugins = numberOfPlugins();
  var uintArray = allocArrayInEmHeap(Uint32Array, nbPlugins);
  var nbBytes = pluginsNamesLengths(uintArray.byteOffset);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  getPluginsList(ucharArray.byteOffset);
  var ret = bytesTypedArrayToStringArray(ucharArray, uintArray, nbPlugins);
  freeArrayInEmHeap(ucharArray);
  freeArrayInEmHeap(uintArray);
  return ret;
};

tulip.getPluginsList = function() {
  return _pluginsListImpl(_numberOfPlugins, _pluginsNamesLengths, _getPluginsList);
};

tulip.getAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfAlgorithms, _algorithmsNamesLengths, _getAlgorithmPluginsList);
};

tulip.getColorAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfColorAlgorithms, _colorAlgorithmsNamesLengths, _getColorAlgorithmPluginsList);
};

tulip.getDoubleAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfDoubleAlgorithms, _doubleAlgorithmsNamesLengths, _getDoubleAlgorithmPluginsList);
};

tulip.getIntegerAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfIntegerAlgorithms, _integerAlgorithmsNamesLengths, _getIntegerAlgorithmPluginsList);
};

tulip.getLayoutAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfLayoutAlgorithms, _layoutAlgorithmsNamesLengths, _getLayoutAlgorithmPluginsList);
};

tulip.getSizeAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfSizeAlgorithms, _sizeAlgorithmsNamesLengths, _getSizeAlgorithmPluginsList);
};

tulip.getStringAlgorithmPluginsList = function() {
  return _pluginsListImpl(_numberOfStringAlgorithms, _stringAlgorithmsNamesLengths, _getStringAlgorithmPluginsList);
};

tulip.getImportPluginsList = function() {
  return _pluginsListImpl(_numberOfImportPlugins, _importPluginsNamesLengths, _getImportPluginsList);
};

tulip.pluginExists = function tulip_pluginExists(pluginName) {
  return tulip.getPluginsList().indexOf(pluginName) != -1;
};

tulip.algorithmExists = function tulip_algoritmExists(algoName) {
  return _algorithmExists(algoName) > 0;
};

tulip.propertyAlgorithmExists = function(algoName) {
  return _propertyAlgorithmExists(algoName) > 0;
};

tulip.booleanAlgorithmExists = function(algoName) {
  return _booleanAlgorithmExists(algoName) > 0;
};

tulip.colorAlgorithmExists = function(algoName) {
  return _colorAlgorithmExists(algoName) > 0;
};

tulip.doubleAlgorithmExists = function(algoName) {
  return _doubleAlgorithmExists(algoName) > 0;
};

tulip.integerAlgorithmExists = function(algoName) {
  return _integerAlgorithmExists(algoName) > 0;
};

tulip.layoutAlgorithmExists = function(algoName) {
  return _layoutAlgorithmExists(algoName) > 0;
};

tulip.stringAlgorithmExists = function(algoName) {
  return _stringAlgorithmExists(algoName) > 0;
};

tulip.sizeAlgorithmExists = function(algoName) {
  return _sizeAlgorithmExists(algoName) > 0;
};

tulip.importPluginExists = function(algoName) {
  return _importPluginExists(algoName) > 0;
};

// ==================================================================================================================

var _Graph_newGraph = Module.cwrap('Graph_newGraph', 'number', []);
var _Graph_delete = Module.cwrap('Graph_delete', null, ['number']);
var _Graph_loadFromTLPBFile = Module.cwrap('Graph_loadFromTLPBFile', null, ['number', 'string']);
var _Graph_applyAlgorithm = Module.cwrap('Graph_applyAlgorithm', 'number', ['number', 'string', 'string', 'number']);
var _Graph_clear = Module.cwrap('Graph_clear', null, ['number']);
var _Graph_addSubGraph1 = Module.cwrap('Graph_addSubGraph1', 'number', ['number', 'number', 'string']);
var _Graph_addSubGraph2 = Module.cwrap('Graph_addSubGraph2', 'number', ['number', 'string']);
var _Graph_addCloneSubGraph = Module.cwrap('Graph_addCloneSubGraph', 'number', ['number', 'string', 'number']);
var _Graph_inducedSubGraph = Module.cwrap('Graph_inducedSubGraph', 'number', ['number', 'number', 'number']);
var _Graph_delSubGraph = Module.cwrap('Graph_delSubGraph', null, ['number', 'number']);
var _Graph_delAllSubGraphs = Module.cwrap('Graph_delAllSubGraphs', null, ['number', 'number']);
var _Graph_getSuperGraph = Module.cwrap('Graph_getSuperGraph', 'number', ['number']);
var _Graph_getRoot = Module.cwrap('Graph_getRoot', 'number', ['number']);
var _Graph_getSubGraphs = Module.cwrap('Graph_getSubGraphs', null, ['number', 'number']);
var _Graph_getNthSubGraph = Module.cwrap('Graph_getNthSubGraph', 'number', ['number', 'number']);
var _Graph_numberOfSubGraphs = Module.cwrap('Graph_numberOfSubGraphs', 'number', ['number']);
var _Graph_numberOfDescendantGraphs = Module.cwrap('Graph_numberOfDescendantGraphs', 'number', ['number']);
var _Graph_isSubGraph = Module.cwrap('Graph_isSubGraph', 'number', ['number', 'number']);
var _Graph_isDescendantGraph = Module.cwrap('Graph_isDescendantGraph', 'number', ['number', 'number']);
var _Graph_getSubGraph1 = Module.cwrap('Graph_getSubGraph1', 'number', ['number', 'number']);
var _Graph_getSubGraph2 = Module.cwrap('Graph_getSubGraph2', 'number', ['number', 'string']);
var _Graph_getDescendantGraph1 = Module.cwrap('Graph_getDescendantGraph1', 'number', ['number', 'number']);
var _Graph_getDescendantGraph2 = Module.cwrap('Graph_getDescendantGraph2', 'number', ['number', 'string']);
var _Graph_getDescendantGraphs = Module.cwrap('Graph_getDescendantGraphs', null, ['number', 'number']);

var _Graph_addNode1 = Module.cwrap('Graph_addNode1', 'number', ['number']);
var _Graph_addNode2 = Module.cwrap('Graph_addNode2', null, ['number', 'number']);
var _Graph_addNodes1 = Module.cwrap('Graph_addNodes1', null, ['number', 'number', 'number']);
var _Graph_addNodes2 = Module.cwrap('Graph_addNodes2', null, ['number', 'number', 'number']);
var _Graph_delNode = Module.cwrap('Graph_delNode', null, ['number', 'number', 'number']);
var _Graph_delNodes = Module.cwrap('Graph_delNodes', null, ['number', 'number', 'number', 'number']);

var _Graph_addEdge1 = Module.cwrap('Graph_addEdge1', 'number', ['number', 'number', 'number']);
var _Graph_addEdge2 = Module.cwrap('Graph_addEdge2', null, ['number', 'number']);
var _Graph_addEdges1 = Module.cwrap('Graph_addEdges1', null, ['number', 'number', 'number', 'number']);
var _Graph_addEdges2 = Module.cwrap('Graph_addEdges2', null, ['number', 'number', 'number']);
var _Graph_delEdge = Module.cwrap('Graph_delEdge', null, ['number', 'number', 'number']);
var _Graph_delEdges = Module.cwrap('Graph_delEdges', null, ['number', 'number', 'number', 'number']);
var _Graph_setEdgeOrder = Module.cwrap('Graph_setEdgeOrder', null, ['number', 'number', 'number', 'number']);
var _Graph_swapEdgeOrder = Module.cwrap('Graph_swapEdgeOrder', null, ['number', 'number', 'number', 'number']);
var _Graph_setSource = Module.cwrap('Graph_setSource', null, ['number', 'number', 'number']);
var _Graph_setTarget = Module.cwrap('Graph_setTarget', null, ['number', 'number', 'number']);
var _Graph_setEnds = Module.cwrap('Graph_setEnds', null, ['number', 'number', 'number', 'number']);
var _Graph_reverse = Module.cwrap('Graph_reverse', null, ['number', 'number']);
var _Graph_getSource = Module.cwrap('Graph_getSource', 'number', ['number']);

var _Graph_getNodes = Module.cwrap('Graph_getNodes', null, ['number', 'number']);
var _Graph_getInNodes = Module.cwrap('Graph_getInNodes', null, ['number', 'number', 'number']);
var _Graph_getOutNodes = Module.cwrap('Graph_getOutNodes', null, ['number', 'number', 'number']);
var _Graph_getInOutNodes = Module.cwrap('Graph_getInOutNodes', null, ['number', 'number', 'number']);
var _Graph_bfs = Module.cwrap('Graph_bfs', null, ['number', 'number', 'number']);
var _Graph_dfs = Module.cwrap('Graph_dfs', null, ['number', 'number', 'number']);
var _Graph_getEdges = Module.cwrap('Graph_getEdges', null, ['number', 'number']);
var _Graph_getOutEdges = Module.cwrap('Graph_getOutEdges', null, ['number', 'number', 'number']);
var _Graph_getInOutEdges = Module.cwrap('Graph_getInOutEdges', null, ['number', 'number', 'number']);
var _Graph_getInEdges = Module.cwrap('Graph_getInEdges', null, ['number', 'number', 'number']);
var _Graph_getRandomNode = Module.cwrap('Graph_getRandomNode', 'number', ['number']);
var _Graph_getRandomEdge = Module.cwrap('Graph_getRandomEdge', 'number', ['number']);

var _Graph_getId = Module.cwrap('Graph_getId', 'number', ['number']);
var _Graph_numberOfNodes = Module.cwrap('Graph_numberOfNodes', 'number', ['number']);
var _Graph_numberOfEdges = Module.cwrap('Graph_numberOfEdges', 'number', ['number']);
var _Graph_deg = Module.cwrap('Graph_deg', 'number', ['number', 'number']);
var _Graph_indeg = Module.cwrap('Graph_indeg', 'number', ['number', 'number']);
var _Graph_outdeg = Module.cwrap('Graph_outdeg', 'number', ['number', 'number']);
var _Graph_source = Module.cwrap('Graph_source', 'number', ['number', 'number']);
var _Graph_target = Module.cwrap('Graph_target', 'number', ['number', 'number']);
var _Graph_ends = Module.cwrap('Graph_ends', null, ['number', 'number', 'number']);
var _Graph_opposite = Module.cwrap('Graph_opposite', 'number', ['number', 'number', 'number']);
var _Graph_isNodeElement = Module.cwrap('Graph_isNodeElement', 'number', ['number', 'number']);
var _Graph_isEdgeElement = Module.cwrap('Graph_isEdgeElement', 'number', ['number', 'number']);
var _Graph_hasEdge = Module.cwrap('Graph_hasEdge', 'number', ['number', 'number', 'number', 'number']);
var _Graph_existEdge = Module.cwrap('Graph_existEdge', 'number', ['number', 'number', 'number', 'number']);
var _Graph_getEdges2 = Module.cwrap('Graph_getEdges2', null, ['number', 'number', 'number', 'number', 'number']);

var _Graph_getName = Module.cwrap('Graph_getName', 'string', ['number']);
var _Graph_setName = Module.cwrap('Graph_setName', null, ['number', 'string']);

var _Graph_numberOfProperties = Module.cwrap('Graph_numberOfProperties', 'number', ['number']);
var _Graph_propertiesNamesLengths = Module.cwrap('Graph_propertiesNamesLengths', 'number', ['number', 'number']);
var _Graph_getProperties = Module.cwrap('Graph_getProperties', null, ['number', 'number']);

var _Graph_getProperty = Module.cwrap('Graph_getProperty', 'number', ['number', 'string']);
var _Graph_getBooleanProperty = Module.cwrap('Graph_getBooleanProperty', 'number', ['number', 'string']);
var _Graph_getLocalBooleanProperty = Module.cwrap('Graph_getLocalBooleanProperty', 'number', ['number', 'string']);
var _Graph_getColorProperty = Module.cwrap('Graph_getColorProperty', 'number', ['number', 'string']);
var _Graph_getLocalColorProperty = Module.cwrap('Graph_getLocalColorProperty', 'number', ['number', 'string']);
var _Graph_getDoubleProperty = Module.cwrap('Graph_getDoubleProperty', 'number', ['number', 'string']);
var _Graph_getLocalDoubleProperty = Module.cwrap('Graph_getLocalDoubleProperty', 'number', ['number', 'string']);
var _Graph_getIntegerProperty = Module.cwrap('Graph_getIntegerProperty', 'number', ['number', 'string']);
var _Graph_getLocalIntegerProperty = Module.cwrap('Graph_getLocalIntegerProperty', 'number', ['number', 'string']);
var _Graph_getLayoutProperty = Module.cwrap('Graph_getLayoutProperty', 'number', ['number', 'string']);
var _Graph_getLocalLayoutProperty = Module.cwrap('Graph_getLocalLayoutProperty', 'number', ['number', 'string']);
var _Graph_getSizeProperty = Module.cwrap('Graph_getSizeProperty', 'number', ['number', 'string']);
var _Graph_getLocalSizeProperty = Module.cwrap('Graph_getLocalSizeProperty', 'number', ['number', 'string']);
var _Graph_getStringProperty = Module.cwrap('Graph_getStringProperty', 'number', ['number', 'string']);
var _Graph_getLocalStringProperty = Module.cwrap('Graph_getLocalStringProperty', 'number', ['number', 'string']);
var _Graph_getBooleanVectorProperty = Module.cwrap('Graph_getBooleanVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalBooleanVectorProperty = Module.cwrap('Graph_getLocalBooleanVectorProperty', 'number', ['number', 'string']);
var _Graph_getColorVectorProperty = Module.cwrap('Graph_getColorVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalColorVectorProperty = Module.cwrap('Graph_getLocalColorVectorProperty', 'number', ['number', 'string']);
var _Graph_getDoubleVectorProperty = Module.cwrap('Graph_getDoubleVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalDoubleVectorProperty = Module.cwrap('Graph_getLocalDoubleVectorProperty', 'number', ['number', 'string']);
var _Graph_getIntegerVectorProperty = Module.cwrap('Graph_getIntegerVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalIntegerVectorProperty = Module.cwrap('Graph_getLocalIntegerVectorProperty', 'number', ['number', 'string']);
var _Graph_getCoordVectorProperty = Module.cwrap('Graph_getCoordVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalCoordVectorProperty = Module.cwrap('Graph_getLocalCoordVectorProperty', 'number', ['number', 'string']);
var _Graph_getSizeVectorProperty = Module.cwrap('Graph_getSizeVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalSizeVectorProperty = Module.cwrap('Graph_getLocalSizeVectorProperty', 'number', ['number', 'string']);
var _Graph_getStringVectorProperty = Module.cwrap('Graph_getStringVectorProperty', 'number', ['number', 'string']);
var _Graph_getLocalStringVectorProperty = Module.cwrap('Graph_getLocalStringVectorProperty', 'number', ['number', 'string']);
var _Graph_delLocalProperty = Module.cwrap('Graph_delLocalProperty', null, ['number', 'string']);
var _Graph_applyPropertyAlgorithm = Module.cwrap('Graph_applyPropertyAlgorithm', 'number', ['number', 'string', 'number', 'string', 'number']);
var _Graph_push = Module.cwrap('Graph_push', null, ['number']);
var _Graph_pop = Module.cwrap('Graph_pop', null, ['number']);
var _Graph_setEventsActivated = Module.cwrap('Graph_setEventsActivated', null, ['number', 'number']);
var _Graph_getAttributesJSON = Module.cwrap('Graph_getAttributesJSON', 'string', ['number']);
var _Graph_isMetaNode = Module.cwrap('Graph_isMetaNode', 'number', ['number', 'number']);
var _Graph_openMetaNode = Module.cwrap('Graph_openMetaNode', null, ['number', 'number']);

var _Graph_isConnected = Module.cwrap('Graph_isConnected', 'number', ['number']);

/**
* This is the description for the tulip.Graph class.
*
* @class Graph
* @constructor
*/
tulip.Graph = function tulip_Graph(cppPointer) {
  var newObject = createObject(tulip.Graph, this);
  if (arguments.length == 0) {
    tulip.CppObjectWrapper.call(newObject, _Graph_newGraph(), 'tlp::Graph');
  } else {
    tulip.CppObjectWrapper.call(newObject, cppPointer, 'tlp::Graph');
  }
  if (!workerMode) {
    graphHierarchyIdToWrapper[newObject.getCppPointer()] = newObject;
  }
  return newObject;
};
tulip.Graph.inheritsFrom(tulip.CppObjectWrapper);
tulip.Graph.prototype.destroy = function() {
  _Graph_delete(this.cppPointer);
  this.cppPointer = 0;
};
tulip.Graph.prototype.applyAlgorithm = function tulip_Graph_prototype_applyAlgorithm(algorithmName, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', 'object', 'boolean'], 1);
  if (!tulip.algorithmExists(algorithmName)) {
    console.log('Error : no Tulip algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters == undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return _Graph_applyAlgorithm(this.cppPointer, algorithmName, JSON.stringify(algoParameters), notifyProgress) > 0;
};
tulip.Graph.prototype.clear = function tulip_Graph_prototype_clear() {
  checkWrappedCppPointer(this.cppPointer);
  _Graph_clear(this.cppPointer);
};
tulip.Graph.prototype.addSubGraph = function tulip_Graph_prototype_addSubGraph() {
  checkWrappedCppPointer(this.cppPointer);
  // addSubGraph(selection, name)
  if (arguments.length == 2) {
    checkArgumentsTypes(arguments, [tulip.BooleanProperty, 'string']);
    return tulip.Graph(_Graph_addSubGraph1(this.cppPointer, arguments[0].cppPointer, arguments[1]));
    // addSubGraph(name)
  } else if (arguments.length == 1) {
    checkArgumentsTypes(arguments, ['string']);
    return tulip.Graph(_Graph_addSubGraph2(this.cppPointer, arguments[0]));
  } else if (arguments.length == 0) {
    return tulip.Graph(_Graph_addSubGraph2(this.cppPointer, ''));
  } else {
    return null;
  }
};
tulip.Graph.prototype.addCloneSubGraph = function tulip_Graph_prototype_addCloneSubGraph(name, addSibling) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', 'boolean']);
  return tulip.Graph(_Graph_addCloneSubGraph(this.cppPointer, name, addSibling));
};
tulip.Graph.prototype.inducedSubGraph = function tulip_Graph_prototype_inducedSubGraph(nodes, parentSubGraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array', tulip.Graph]);
  checkArrayOfType(nodes, tulip.Node, 0);
  var nodesIdsArray = allocArrayInEmHeap(Uint32Array, nodes.length+1);
  for (var i = 0 ; i < nodes.length ; ++i) {
    nodesIdsArray[i] = nodes[i].id;
  }
  nodesIdsArray[nodes.length] = UINT_MAX;
  var sg = tulip.Graph(_Graph_inducedSubGraph(this.cppPointer, nodesIdsArray.byteOffset, parentSubGraph ? parentSubGraph.cppPointer : 0));
  freeArrayInEmHeap(nodesIdsArray);
  return sg;
};
tulip.Graph.prototype.delSubGraph = function tulip_Graph_prototype_delSubGraph(sg) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph]);
  _Graph_delSubGraph(this.cppPointer, sg.cppPointer);
};
tulip.Graph.prototype.delAllSubGraphs = function tulip_Graph_prototype_delAllSubGraphs(sg) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph]);
  _Graph_delAllSubGraphs(this.cppPointer, sg.cppPointer);
};
tulip.Graph.prototype.getSuperGraph = function tulip_Graph_prototype_getSuperGraph() {
  checkWrappedCppPointer(this.cppPointer);
  return tulip.Graph(_Graph_getSuperGraph(this.cppPointer));
};
tulip.Graph.prototype.getRoot = function tulip_Graph_prototype_getRoot() {
  checkWrappedCppPointer(this.cppPointer);
  return tulip.Graph(_Graph_getRoot(this.cppPointer));
};
tulip.Graph.prototype.getSubGraphs = function tulip_Graph_prototype_getSubGraphs() {
  checkWrappedCppPointer(this.cppPointer);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.numberOfSubGraphs(), function(byteOffset){_Graph_getSubGraphs(graphObject.cppPointer, byteOffset);}, tulip.Graph);
};
tulip.Graph.prototype.getNthSubGraph = function tulip_Graph_prototype_getNthSubGraph(n) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number']);
  return tulip.Graph(_Graph_getNthSubGraph(this.cppPointer, n));
};
tulip.Graph.prototype.numberOfSubGraphs = function tulip_Graph_prototype_numberOfSubGraphs() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_numberOfSubGraphs(this.cppPointer);
};
tulip.Graph.prototype.numberOfDescendantGraphs = function tulip_Graph_prototype_numberOfDescendantGraphs() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_numberOfDescendantGraphs(this.cppPointer);
};
tulip.Graph.prototype.isSubGraph = function tulip_Graph_prototype_isSubGraph(subGraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph], 1);
  return _Graph_isSubGraph(this.cppPointer, subGraph.cppPointer);
};
tulip.Graph.prototype.isDescendantGraph = function tulip_Graph_prototype_isDescendantGraph(subGraph) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Graph], 1);
  return _Graph_isDescendantGraph(this.cppPointer, subGraph.cppPointer);
};
tulip.Graph.prototype.getSubGraph = function tulip_Graph_prototype_getSubGraph() {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [['number', 'string']], 1);
  if (typeOf(arguments[0]) == 'string') {
    var sgPointer = _Graph_getSubGraph2(this.cppPointer, arguments[0]);
    return sgPointer ? tulip.Graph(sgPointer) : null;
  } else {
    var sgPointer = _Graph_getSubGraph1(this.cppPointer, arguments[0]);
    return sgPointer ? tulip.Graph(sgPointer) : null;
  }
};
tulip.Graph.prototype.getDescendantGraph = function tulip_Graph_prototype_getDescendantGraph() {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [['number', 'string']], 1);
  if (typeOf(arguments[0]) == 'string') {
    var sgPointer = _Graph_getDescendantGraph2(this.cppPointer, arguments[0]);
    return sgPointer ? tulip.Graph(sgPointer) : null;
  } else {
    var sgPointer = _Graph_getDescendantGraph1(this.cppPointer, arguments[0]);
    return sgPointer ? tulip.Graph(sgPointer) : null;
  }
};
tulip.Graph.prototype.getDescendantGraphs = function tulip_Graph_prototype_getDescendantGraphs() {
  checkWrappedCppPointer(this.cppPointer);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.numberOfDescendantGraphs(), function(byteOffset){_Graph_getDescendantGraphs(graphObject.cppPointer, byteOffset);}, tulip.Graph);
};
tulip.Graph.prototype.addNode = function tulip_Graph_prototype_addNode() {
  checkWrappedCppPointer(this.cppPointer);
  if (arguments.length == 0) {
    return tulip.Node(_Graph_addNode1(this.cppPointer));
  } else {
    checkArgumentsTypes(arguments, [tulip.Node], 1);
    _Graph_addNode2(this.cppPointer, arguments[0].id);
  }
};
tulip.Graph.prototype.addNodes = function tulip_Graph_prototype_addNodes() {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [['number', 'array']], 1);
  // addNodes(nbNodes) -> array of tulip.Node
  if (typeOf(arguments[0]) == 'number') {
    var nbNodes = arguments[0];
    var graphObject = this;
    return getArrayOfTulipType(nbNodes, function(byteOffset){_Graph_addNodes1(graphObject.cppPointer, nbNodes, byteOffset);}, tulip.Node);

    // addNodes(array of tulip.Node)
  } else {
    var nodes = arguments[0];
    checkArrayOfType(nodes, tulip.Node, 0);
    var nodesIdsArray = allocArrayInEmHeap(Uint32Array, nodes.length);
    for (var i = 0 ; i < nodes.length ; ++i) {
      nodesIdsArray[i] = nodes[i].id;
    }
    _Graph_addNodes2(this.cppPointer, nodes.length, nodesIdsArray.byteOffset);
    freeArrayInEmHeap(nodesIdsArray);
  }
};
tulip.Graph.prototype.delNode = function tulip_Graph_prototype_delNode(node, deleteInAllGraphs) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'boolean'], 1);
  if (arguments.length == 1) {
    deleteInAllGraphs = false;
  }
  _Graph_delNode(this.cppPointer, node.id, deleteInAllGraphs);
};
tulip.Graph.prototype.delNodes = function tulip_Graph_prototype_delNodes(nodes, deleteInAllGraphs) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array', 'boolean'], 1);
  checkArrayOfType(nodes, tulip.Node, 0);
  if (arguments.length == 1) {
    deleteInAllGraphs = false;
  }
  var nodesIdsArray = allocArrayInEmHeap(Uint32Array, nodes.length);
  for (var i = 0 ; i < nodes.length ; ++i) {
    nodesIdsArray[i] = nodes[i].id;
  }
  _Graph_delNodes(this.cppPointer, nodes.length, nodesIdsArray.byteOffset, deleteInAllGraphs);
  freeArrayInEmHeap(nodesIdsArray);
};
/**
* Adds a new edge in the graph
*
* @method addEdge
* @param {Node} src the source node
* @param {Node} tgt the target node
* @return {Edge} Returns a new graph edge
*/
tulip.Graph.prototype.addEdge = function tulip_Graph_prototype_addEdge() {
  checkWrappedCppPointer(this.cppPointer);
  // addEdge(tulip.Edge)
  if (arguments.length <= 1) {
    checkArgumentsTypes(arguments, [tulip.Edge], 1);
    var edge = arguments[0];
    _Graph_addEdge2(this.cppPointer, edge.id);
    // addEdge(tulip.Node, tulip.Node) -> tulip.Edge
  } else {
    checkArgumentsTypes(arguments, [tulip.Node, tulip.Node], 2);
    var src = arguments[0];
    var tgt = arguments[1];
    return tulip.Edge(_Graph_addEdge1(this.cppPointer, src.id, tgt.id));
  }
};
tulip.Graph.prototype.addEdges = function tulip_Graph_prototype_addEdges() {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  try {
    // addEdge(array of [tulip.Node, tulip.Node])
    checkArrayOfType(arguments[0], 'array');
    try {
      var nodes = arguments[0];
      for (var i = 0 ; i < nodes.length ; ++i) {
        if (nodes[i].length != 2) {
          throw 'error';
        } else {
          checkArrayOfType(nodes[i], tulip.Node);
        }
      }
      var nodesIdsArray = allocArrayInEmHeap(Uint32Array, nodes.length*2);
      for (var i = 0 ; i < nodes.length ; ++i) {
        nodesIdsArray[2*i] = nodes[i][0].id;
        nodesIdsArray[2*i+1] = nodes[i][1].id;
      }
      var graphObject = this;
      var edges = getArrayOfTulipType(nodes.length, function(byteOffset){_Graph_addEdges1(graphObject.cppPointer, nodes.length, nodesIdsArray.byteOffset, byteOffset);}, tulip.Edge);
      freeArrayInEmHeap(nodesIdsArray);
      return edges;
    } catch (err) {
      throw new TypeError('Error when calling function \'tulip.Graph.prototype.addEdges\', parameter 0 must be an array of arrays containing two instances of tulip.Node objects');
    }
  } catch (err) {
    // addEdge(array of tulip.Edge)
    checkArrayOfType(arguments[0], tulip.Edge);
    var edges = arguments[0];
    var edgesIdsArray = allocArrayInEmHeap(Uint32Array, edges.length);
    for (var i = 0 ; i < edges.length ; ++i) {
      edgesIdsArray[i] = edges[i].id;
    }
    _Graph_addEdges2(this.cppPointer, edges.length, edgesIdsArray.byteOffset);
    freeArrayInEmHeap(edgesIdsArray);
  }
};
tulip.Graph.prototype.delEdge = function tulip_Graph_prototype_delEdge(edge, deleteInAllGraphs) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'boolean'], 1);
  if (arguments.length == 1) {
    deleteInAllGraphs = false;
  }
  _Graph_delEdge(this.cppPointer, edge.id, deleteInAllGraphs);
};
tulip.Graph.prototype.delEdges = function tulip_Graph_prototype_delEdges(edges, deleteInAllGraphs) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array', 'boolean'], 1);
  checkArrayOfType(edges, tulip.Edge, 0);
  if (arguments.length == 1) {
    deleteInAllGraphs = false;
  }
  var edgesIdsArray = allocArrayInEmHeap(Uint32Array, edges.length);
  for (var i = 0 ; i < edges.length ; ++i) {
    edgesIdsArray[i] = edges[i].id;
  }
  _Graph_delEdges(this.cppPointer, edges.length, edgesIdsArray.byteOffset, deleteInAllGraphs);
  freeArrayInEmHeap(edgesIdsArray);
};
tulip.Graph.prototype.setEdgeOrder = function tulip_Graph_prototype_setEdgeOrder(node, edges) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'array'], 2);
  checkArrayOfType(edges, tulip.Edge);
  var edgesIdsArray = allocArrayInEmHeap(Uint32Array, edges.length);
  for (var i = 0 ; i < edges.length ; ++i) {
    edgesIdsArray[i] = edges[i].id;
  }
  _Graph_setEdgeOrder(this.cppPointer, node.id, edges.length, edgesIdsArray.byteOffset);
  freeArrayInEmHeap(edgesIdsArray);
};
tulip.Graph.prototype.swapEdgeOrder = function tulip_Graph_prototype_swapEdgeOrder(node, edge1, edge2) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, tulip.Edge, tulip.Edge], 3);
  _Graph_swapEdgeOrder(this.cppPointer, node.id, edge1.id, edge2.id);
};
tulip.Graph.prototype.setSource = function tulip_Graph_prototype_setSource(edge, node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, tulip.Node], 2);
  _Graph_setSource(this.cppPointer, edge.id, node.id);
};
tulip.Graph.prototype.setTarget = function tulip_Graph_prototype_setTarget(edge, node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, tulip.Node], 2);
  _Graph_setTarget(this.cppPointer, edge.id, node.id);
};
tulip.Graph.prototype.setEnds = function tulip_Graph_prototype_setEnds(edge, source, target) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, tulip.Node, tulip.Node], 3);
  _Graph_setEnds(this.cppPointer, edge.id, source.id, target.id);
};
tulip.Graph.prototype.reverse = function tulip_Graph_prototype_reverse(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  _Graph_reverse(this.cppPointer, edge.id);
};
tulip.Graph.prototype.getSource = function tulip_Graph_prototype_getSource() {
  checkWrappedCppPointer(this.cppPointer);
  return tulip.Node(_Graph_getSource(this.cppPointer));
};
tulip.Graph.prototype.getNodes = function tulip_Graph_prototype_getNodes() {
  checkWrappedCppPointer(this.cppPointer);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.numberOfNodes(), function(byteOffset){_Graph_getNodes(graphObject.cppPointer, byteOffset);}, tulip.Node);
};
tulip.Graph.prototype.getRandomNode = function tulip_Graph_prototype_getRandomNode() {
  checkWrappedCppPointer(this.cppPointer);
  return tulip.Node(_Graph_getRandomNode(this.cppPointer));
};
tulip.Graph.prototype.getInNodes = function tulip_Graph_prototype_getInNodes(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.indeg(node), function(byteOffset){_Graph_getInNodes(graphObject.cppPointer, node.id, byteOffset);}, tulip.Node);
};
tulip.Graph.prototype.getOutNodes = function tulip_Graph_prototype_getOutNodes(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.outdeg(node), function(byteOffset){_Graph_getOutNodes(graphObject.cppPointer, node.id, byteOffset);}, tulip.Node);
};
tulip.Graph.prototype.getInOutNodes = function tulip_Graph_prototype_getInOutNodes(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.deg(node), function(byteOffset){_Graph_getInOutNodes(graphObject.cppPointer, node.id, byteOffset);}, tulip.Node);
};
tulip.Graph.prototype.bfs = function tulip_Graph_prototype_bfs(root) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  if (arguments.length == 0) {
    return getArrayOfTulipType(graphObject.numberOfNodes(), function(byteOffset){_Graph_bfs(graphObject.cppPointer, UINT_MAX, byteOffset);}, tulip.Node);
  } else {
    return getArrayOfTulipType(graphObject.numberOfNodes(), function(byteOffset){_Graph_bfs(graphObject.cppPointer, root.id, byteOffset);}, tulip.Node);
  }
};
tulip.Graph.prototype.dfs = function tulip_Graph_prototype_dfs(root) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  if (arguments.length == 0) {
    return getArrayOfTulipType(graphObject.numberOfNodes(), function(byteOffset){_Graph_dfs(graphObject.cppPointer, UINT_MAX, byteOffset);}, tulip.Node);
  } else {
    return getArrayOfTulipType(graphObject.numberOfNodes(), function(byteOffset){_Graph_dfs(graphObject.cppPointer, root.id, byteOffset);}, tulip.Node);
  }
};
tulip.Graph.prototype.getEdges = function tulip_Graph_prototype_getEdges() {
  checkWrappedCppPointer(this.cppPointer);
  // getEdges()
  if (arguments.length == 0) {
    var graphObject = this;
    return getArrayOfTulipType(graphObject.numberOfEdges(), function(byteOffset){_Graph_getEdges(graphObject.cppPointer, byteOffset);}, tulip.Edge);
    // getEdges(tulip.Node, tulip.Node, boolean)
  } else {
    checkArgumentsTypes(arguments, [tulip.Node, tulip.Node, 'boolean'], 2);
    var directed = true;
    if (arguments.length > 2) directed = arguments[2];
    return getArrayOfTulipType(graphObject.deg(arguments[0]), function(byteOffset){_Graph_getEdges2(this.cppPointer, arguments[0].id, arguments[1].id, directed, byteOffset);}, tulip.Edge);
  }
};
tulip.Graph.prototype.getRandomEdge = function tulip_Graph_prototype_getRandomEdge() {
  checkWrappedCppPointer(this.cppPointer);
  return tulip.Edge(_Graph_getRandomEdge(this.cppPointer));
};
tulip.Graph.prototype.getOutEdges = function tulip_Graph_prototype_getOutEdges(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.outdeg(node), function(byteOffset){_Graph_getOutEdges(graphObject.cppPointer, node.id, byteOffset);}, tulip.Edge);
};
tulip.Graph.prototype.getInOutEdges = function tulip_Graph_prototype_getInOutEdges(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.deg(node), function(byteOffset){_Graph_getInOutEdges(graphObject.cppPointer, node.id, byteOffset);}, tulip.Edge);
};
tulip.Graph.prototype.getInEdges = function tulip_Graph_prototype_getInEdges(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  var graphObject = this;
  return getArrayOfTulipType(graphObject.indeg(node), function(byteOffset){_Graph_getInEdges(graphObject.cppPointer, node.id, byteOffset);}, tulip.Edge);
};
tulip.Graph.prototype.getId = function tulip_Graph_prototype_getId() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_getId(this.cppPointer);
};
tulip.Graph.prototype.numberOfNodes = function tulip_Graph_prototype_numberOfNodes() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_numberOfNodes(this.cppPointer);
};
tulip.Graph.prototype.numberOfEdges = function tulip_Graph_prototype_numberOfEdges() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_numberOfEdges(this.cppPointer);
};
tulip.Graph.prototype.deg = function tulip_Graph_prototype_deg(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _Graph_deg(this.cppPointer, node.id);
};
tulip.Graph.prototype.indeg = function tulip_Graph_prototype_indeg(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _Graph_indeg(this.cppPointer, node.id);
};
tulip.Graph.prototype.outdeg = function tulip_Graph_prototype_outdeg(node) {
  checkArgumentsTypes(arguments, [tulip.Node]);
  return _Graph_outdeg(this.cppPointer, node.id);
};
tulip.Graph.prototype.source = function tulip_Graph_prototype_source(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return tulip.Node(_Graph_source(this.cppPointer, edge.id));
};
tulip.Graph.prototype.target = function tulip_Graph_prototype_target(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return tulip.Node(_Graph_target(this.cppPointer, edge.id));
};
tulip.Graph.prototype.ends = function tulip_Graph_prototype_ends(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge]);
  return getArrayOfTulipType(2, function(byteOffset){_Graph_ends(graphObject.cppPointer, edge.id, byteOffset);}, tulip.Node);
};
tulip.Graph.prototype.opposite = function tulip_Graph_prototype_opposite(edge, node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, tulip.Node]);
  return tulip.Node(_Graph_opposite(this.cppPointer, edge.id, node.id));
};
tulip.Graph.prototype.isElement = function tulip_Graph_prototype_isElement(elem) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [[tulip.Edge, tulip.Node]]);
  if (elem instanceof tulip.Node) {
    return _Graph_isNodeElement(this.cppPointer, elem.id) > 0;
  } else {
    return _Graph_isEdgeElement(this.cppPointer, elem.id) > 0;
  }
};
tulip.Graph.prototype.hasEdge = function tulip_Graph_prototype_hasEdge(sourceNode, targetNode, directed) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, tulip.Node, 'boolean'], 2);
  if (directed == undefined) directed = true;
  return _Graph_hasEdge(this.cppPointer, sourceNode.id, targetNode.id, directed) > 0;
};
tulip.Graph.prototype.existEdge = function tulip_Graph_prototype_existEdge(sourceNode, targetNode, directed) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, tulip.Node, 'boolean'], 2);
  if (directed == undefined) directed = true;
  return tulip.Edge(_Graph_existEdge(this.cppPointer, sourceNode.id, targetNode.id, directed));
};
tulip.Graph.prototype.getName = function tulip_Graph_prototype_getName() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_getName(this.cppPointer);
};
tulip.Graph.prototype.setName = function tulip_Graph_prototype_setName(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  _Graph_setName(this.cppPointer, name);
};
tulip.Graph.prototype.getProperties = function tulip_Graph_prototype_getProperties() {
  checkWrappedCppPointer(this.cppPointer);
  var nbProperties = _Graph_numberOfProperties(this.cppPointer);
  var uintArray = allocArrayInEmHeap(Uint32Array, nbProperties);
  var nbBytes = _Graph_propertiesNamesLengths(this.cppPointer, uintArray.byteOffset);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbBytes);
  _Graph_getProperties(this.cppPointer, ucharArray.byteOffset);
  var ret = bytesTypedArrayToStringArray(ucharArray, uintArray, nbProperties);
  freeArrayInEmHeap(uintArray);
  freeArrayInEmHeap(ucharArray);
  return ret;
};
tulip.Graph.prototype.getProperty = function tulip_Graph_prototype_getPropery(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  var typedProperty = null;
  var propertyPointer = _Graph_getProperty(this.cppPointer, name);
  if (propertyPointer) {
    var prop = tulip.PropertyInterface(propertyPointer, true);
    var propertyType = prop.getTypename();
    switch (propertyType) {
    case 'bool':
      typedProperty = this.getBooleanProperty(name);
      break;
    case 'color':
      typedProperty = this.getColorProperty(name);
      break;
    case 'double':
      typedProperty = this.getDoubleProperty(name);
      break;
    case 'int' :
      typedProperty = this.getIntegerProperty(name);
      break;
    case 'layout':
      typedProperty = this.getLayoutProperty(name);
      break;
    case 'size':
      typedProperty = this.getSizeProperty(name);
      break;
    case 'string':
      typedProperty = this.getStringProperty(name);
      break;
    case 'vector<bool>':
      typedProperty = this.getBooleanVectorProperty(name);
      break;
    case 'vector<color>':
      typedProperty = this.getColorVectorProperty(name);
      break;
    case 'vector<double>':
      typedProperty = this.getDoubleVectorProperty(name);
      break;
    case 'vector<int>' :
      typedProperty = this.getIntegerVectorProperty(name);
      break;
    case 'vector<coord>':
      typedProperty = this.getCoordVectorProperty(name);
      break;
    case 'vector<size>':
      typedProperty = this.getSizeVectorProperty(name);
      break;
    case 'vector<string>':
      typedProperty = this.getStringVectorProperty(name);
      break;
    default:
      break;
    }
  }
  return typedProperty;
};
tulip.Graph.prototype.getBooleanProperty = function tulip_Graph_prototype_getBooleanProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.BooleanProperty(_Graph_getBooleanProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalBooleanProperty = function tulip_Graph_prototype_getLocalBooleanProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.BooleanProperty(_Graph_getLocalBooleanProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getBooleanVectorProperty = function tulip_Graph_prototype_getBooleanVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.BooleanVectorProperty(_Graph_getBooleanVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalBooleanVectorProperty = function tulip_Graph_prototype_getLocalBooleanVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.BooleanVectorProperty(_Graph_getLocalBooleanVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getColorProperty = function tulip_Graph_prototype_getColorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.ColorProperty(_Graph_getColorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalColorProperty = function tulip_Graph_prototype_getLocalColorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.ColorProperty(_Graph_getLocalColorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getColorVectorProperty = function tulip_Graph_prototype_getColorVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.ColorVectorProperty(_Graph_getColorVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalColorVectorProperty = function tulip_Graph_prototype_getLocalColorVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.ColorVectorProperty(_Graph_getLocalColorVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getDoubleProperty = function tulip_Graph_prototype_getDoubleProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.DoubleProperty(_Graph_getDoubleProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalDoubleProperty = function tulip_Graph_prototype_getLocalDoubleProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.DoubleProperty(_Graph_getLocalDoubleProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getDoubleVectorProperty = function tulip_Graph_prototype_getDoubleVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.DoubleVectorProperty(_Graph_getDoubleVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalDoubleVectorProperty = function tulip_Graph_prototype_getLocalDoubleVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.DoubleVectorProperty(_Graph_getLocalDoubleVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getIntegerProperty = function tulip_Graph_prototype_getIntegerProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.IntegerProperty(_Graph_getIntegerProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalIntegerProperty = function tulip_Graph_prototype_getLocalIntegerProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.IntegerProperty(_Graph_getLocalIntegerProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getIntegerVectorProperty = function tulip_Graph_prototype_getIntegerVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.IntegerVectorProperty(_Graph_getIntegerVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalIntegerVectorProperty = function tulip_Graph_prototype_getLocalIntegerVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.IntegerVectorProperty(_Graph_getLocalIntegerVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLayoutProperty = function tulip_Graph_prototype_getLayoutProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.LayoutProperty(_Graph_getLayoutProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalLayoutProperty = function tulip_Graph_prototype_getLocalLayoutProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.LayoutProperty(_Graph_getLocalLayoutProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getCoordVectorProperty = function tulip_Graph_prototype_getCoordVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.CoordVectorProperty(_Graph_getCoordVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalCoordVectorProperty = function tulip_Graph_prototype_getLocalCoordVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.CoordVectorProperty(_Graph_getLocalCoordVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getSizeProperty = function tulip_Graph_prototype_getSizeProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.SizeProperty(_Graph_getSizeProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalSizeProperty = function tulip_Graph_prototype_getLocalSizeProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.SizeProperty(_Graph_getLocalSizeProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getSizeVectorProperty = function tulip_Graph_prototype_getSizeVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.SizeVectorProperty(_Graph_getSizeVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalSizeVectorProperty = function tulip_Graph_prototype_getLocalSizeVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.SizeVectorProperty(_Graph_getLocalSizeVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getStringProperty = function tulip_Graph_prototype_getStringProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.StringProperty(_Graph_getStringProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalStringProperty = function tulip_Graph_prototype_getLocalStringProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.StringProperty(_Graph_getLocalStringProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getStringVectorProperty = function tulip_Graph_prototype_getStringVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.StringVectorProperty(_Graph_getStringVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.getLocalStringVectorProperty = function tulip_Graph_prototype_getLocalStringVectorProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string']);
  return tulip.StringVectorProperty(_Graph_getLocalStringVectorProperty(this.cppPointer, name));
};
tulip.Graph.prototype.delLocalProperty = function tulip_Graph_prototype_delLocalProperty(name) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string'], 1);
  _Graph_delLocalProperty(this.cppPointer, name);
};
tulip.Graph.prototype.toJSON = function tulip_Graph_prototype_toJSON() {
  checkWrappedCppPointer(this.cppPointer);
  return _getJSONGraph(this.cppPointer);
};
tulip.Graph.prototype.getNodePropertiesValues = function tulip_Graph_prototype_getNodePropertiesValues(node) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  var ret = {};
  var properties = this.getProperties();
  for (var i = 0 ; i < properties.length ; ++i) {
    var propName = properties[i];
    if (propName == 'viewMetaGraph') {
      continue;
    }
    var prop = graph.getProperty(propName);
    ret[propName] = prop.getNodeValue(node);
  }
  return ret;
};
tulip.Graph.prototype.setNodePropertiesValues = function tulip_Graph_prototype_setNodePropertiesValues(node, values) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node, 'object'], 2);
  for (var propertyName in values) {
    if (values.hasOwnProperty(propertyName)) {
      var prop = this.getProperty(propertyName);
      if (!prop) {
        console.log('Error : no graph property named \'' + propertyName + '\'');
      }
      prop.setNodeValue(node, values[propertyName]);
    }
  }
};
tulip.Graph.prototype.setAllNodePropertiesValues = function tulip_Graph_prototype_setAllNodePropertiesValues(values) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['object'], 2);
  for (var propertyName in values) {
    if (values.hasOwnProperty(propertyName)) {
      var prop = this.getProperty(propertyName);
      if (!prop) {
        console.log('Error : no graph property named \'' + propertyName + '\'');
      }
      prop.setAllNodeValue(values[propertyName]);
    }
  }
};
tulip.Graph.prototype.getEdgePropertiesValues = function tulip_Graph_prototype_getEdgePropertiesValues(edge) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge], 1);
  var ret = {};
  var properties = this.getProperties();
  for (var i = 0 ; i < properties.length ; ++i) {
    var propName = properties[i];
    if (propName == 'viewMetaGraph') {
      continue;
    }
    var prop = graph.getProperty(propName);
    ret[propName] = prop.getEdgeValue(edge);
  }
  return ret;
};
tulip.Graph.prototype.setEdgePropertiesValues = function tulip_Graph_prototype_setEdgePropertiesValues(edge, values) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Edge, 'object'], 2);
  for (var propertyName in values) {
    if (values.hasOwnProperty(propertyName)) {
      var prop = this.getProperty(propertyName);
      if (!prop) {
        console.log('Error : no graph property named \'' + propertyName + '\'');
      }
      prop.setEdgeValue(edge, values[propertyName]);
    }
  }
};
tulip.Graph.prototype.setAllEdgePropertiesValues = function tulip_Graph_prototype_setAllEdgePropertiesValues(values) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['object'], 2);
  for (var propertyName in values) {
    if (values.hasOwnProperty(propertyName)) {
      var prop = this.getProperty(propertyName);
      if (!prop) {
        console.log('Error : no graph property named \'' + propertyName + '\'');
      }
      prop.setAllEdgeValue(values[propertyName]);
    }
  }
};
tulip.Graph.prototype.applyPropertyAlgorithm = function tulip_Graph_prototype_applyPropertyAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', tulip.PropertyInterface, 'object', 'boolean'], 2);
  if (!tulip.propertyAlgorithmExists(algorithmName)) {
    console.log('Error : no Tulip property algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters === undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return _Graph_applyPropertyAlgorithm(this.cppPointer, algorithmName, resultProperty.cppPointer, JSON.stringify(algoParameters), notifyProgress) > 0;
};

tulip.Graph.prototype.applyBooleanAlgorithm = function tulip_Graph_prototype_applyBooleanAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', tulip.BooleanProperty, 'object', 'boolean'], 2);
  if (!tulip.booleanAlgorithmExists(algorithmName)) {
    console.log('Error : no Tulip boolean algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters === undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return this.applyPropertyAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress);
};

tulip.Graph.prototype.applyColorAlgorithm = function tulip_Graph_prototype_applyColorAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', tulip.ColorProperty, 'object', 'boolean'], 2);
  if (!tulip.colorAlgorithmExists(algorithmName)) {
    console.log('Error : no Tulip color algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters === undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return this.applyPropertyAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress);
};

tulip.Graph.prototype.applyDoubleAlgorithm = function tulip_Graph_prototype_applyDoubleAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', tulip.DoubleProperty, 'object', 'boolean'], 2);
  if (!tulip.doubleAlgorithmExists(algorithmName)) {
    console.log('Error : no Tulip double algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters === undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return this.applyPropertyAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress);
};

tulip.Graph.prototype.applyLayoutAlgorithm = function tulip_Graph_prototype_applyLayoutAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', tulip.LayoutProperty, 'object', 'boolean'], 2);
  if (!tulip.layoutAlgorithmExists(algorithmName)) {
    console.log('Error : no Tulip layout algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters === undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return this.applyPropertyAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress);
};

tulip.Graph.prototype.applySizeAlgorithm = function tulip_Graph_prototype_applySizeAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['string', tulip.SizeProperty, 'object', 'boolean'], 2);
  if (!tulip.sizeAlgorithmExists(algorithmName)) {
    console.log('Error : no Tulip size algorithm named \'' + algorithmName + '\'');
    return false;
  }
  if (algoParameters === undefined) algoParameters = {};
  if (notifyProgress == undefined) notifyProgress = false;
  return this.applyPropertyAlgorithm(algorithmName, resultProperty, algoParameters, notifyProgress);
};

tulip.Graph.prototype.push = function tulip_Graph_prototype_push() {
  checkWrappedCppPointer(this.cppPointer);
  _Graph_push(this.cppPointer);
};

tulip.Graph.prototype.pop = function tulip_Graph_prototype_pop() {
  checkWrappedCppPointer(this.cppPointer);
  _Graph_pop(this.cppPointer);
};

tulip.Graph.prototype.setEventsActivated = function tulip_Graph_prototype_setEventsActivated(eventsActivated) {
  checkWrappedCppPointer(this.cppPointer);
  _Graph_setEventsActivated(this.cppPointer, eventsActivated);
};

tulip.Graph.prototype.getAttributes = function tulip_Graph_prototype_getAttributes() {
  checkWrappedCppPointer(this.cppPointer);
  return JSON.parse(_Graph_getAttributesJSON(this.cppPointer));
};

tulip.Graph.prototype.getAttribute = function tulip_Graph_prototype_getAttribute(name) {
  checkWrappedCppPointer(this.cppPointer);
  var attributes = this.getAttributes();
  if (name in attributes) {
    return attributes[name];
  } else {
    return undefined;
  }
};

tulip.Graph.prototype.isMetaNode = function tulip_Graph_prototype_isMetaNode(n) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  return _Graph_isMetaNode(this.cppPointer, n.id) > 0;
};

tulip.Graph.prototype.openMetaNode = function tulip_Graph_prototype_openMetaNode(n) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, [tulip.Node], 1);
  _Graph_openMetaNode(this.cppPointer, n.id);
};

tulip.Graph.prototype.isConnected = function tulip_Graph_prototype_isConnected() {
  checkWrappedCppPointer(this.cppPointer);
  return _Graph_isConnected(this.cppPointer) > 0;
};

if (!nodejs) {

  var _computeGraphHullVertices = Module.cwrap('computeGraphHullVertices', null, ['number', 'number']);

  tulip.Graph.prototype.computeGraphHullVertices = function(withHoles) {
    if (!withHoles) {
      withHoles = false;
    }
    _computeGraphHullVertices(this.cppPointer, withHoles);
  };

}

// ==================================================================================================================

var _ColorScale_newColorScale = Module.cwrap('ColorScale_newColorScale', 'number', []);
var _ColorScale_setColorScale = Module.cwrap('ColorScale_setColorScale', null, ['number', 'number', 'number']);
var _ColorScale_setColorAtPos = Module.cwrap('ColorScale_setColorAtPos', null, ['number', 'number', 'number', 'number', 'number', 'number']);
var _ColorScale_getColorAtPos = Module.cwrap('ColorScale_getColorAtPos', null, ['number', 'number', 'number']);
var _ColorScale_numberOfColors = Module.cwrap('ColorScale_numberOfColors', 'number', ['number']);
var _ColorScale_getOffsets = Module.cwrap('ColorScale_getOffsets', null, ['number', 'number']);
var _ColorScale_getColors = Module.cwrap('ColorScale_getColors', null, ['number', 'number']);

tulip.ColorScale = function tulip_ColorScale() {
  var newObject = createObject(tulip.ColorScale, this);
  tulip.CppObjectWrapper.call(newObject, _ColorScale_newColorScale(), 'tlp::ColorScale');
  if (arguments.length == 1) {
    checkArgumentsTypes(arguments, ['array']);
    checkArrayOfType(arguments[0], tulip.Color);
    newObject.setColorScale(arguments[0]);
  }

  return newObject;
};

tulip.ColorScale.prototype.setColorScale = function tulip_ColorScale_prototype_setColorScale(colors) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['array'], 1);
  checkArrayOfType(colors, tulip.Color, 0);
  var ucharArray = allocArrayInEmHeap(Uint8Array, colors.length * 4);
  for (var i = 0 ; i < colors.length ; ++i) {
    ucharArray[4*i] = colors[i].r;
    ucharArray[4*i+1] = colors[i].g;
    ucharArray[4*i+2] = colors[i].b;
    ucharArray[4*i+3] = colors[i].a;
  }
  _ColorScale_setColorScale(this.cppPointer, ucharArray.byteOffset, colors.length);
  freeArrayInEmHeap(ucharArray);
};

tulip.ColorScale.prototype.setColorAtPos = function tulip_ColorScale_prototype_setColorAtPos(pos, color) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number', tulip.Color], 2);
  _ColorScale_setColorAtPos(this.cppPointer, pos, color.r, color.g, color.b, color.a);
};

tulip.ColorScale.prototype.getColorAtPos = function tulip_ColorScale_prototype_setColorAtPos(pos) {
  checkWrappedCppPointer(this.cppPointer);
  checkArgumentsTypes(arguments, ['number'], 1);
  var ucharArray = allocArrayInEmHeap(Uint8Array, 4);
  _ColorScale_getColorAtPos(this.cppPointer, pos, ucharArray.byteOffset);
  var ret = tulip.Color(ucharArray[0], ucharArray[1], ucharArray[2], ucharArray[3]);
  freeArrayInEmHeap(ucharArray);
  return ret;
};

tulip.ColorScale.prototype.getColorMap = function() {
  checkWrappedCppPointer(this.cppPointer);
  var nbColors = _ColorScale_numberOfColors(this.cppPointer);
  var floatArray = allocArrayInEmHeap(Float32Array, nbColors);
  var ucharArray = allocArrayInEmHeap(Uint8Array, nbColors*4);
  _ColorScale_getOffsets(this.cppPointer, floatArray.byteOffset);
  _ColorScale_getColors(this.cppPointer, ucharArray.byteOffset);
  var ret = {};
  for (var i = 0 ; i < nbColors ; ++i) {
    ret[floatArray[i]] = tulip.Color(ucharArray[4*i], ucharArray[4*i+1], ucharArray[4*i+2], ucharArray[4*i+3]);
  }
  freeArrayInEmHeap(floatArray);
  freeArrayInEmHeap(ucharArray);
  return ret;
};

// ==================================================================================================================

var _holdObservers = Module.cwrap('holdObservers', null, []);
var _unholdObservers = Module.cwrap('unholdObservers', null, []);

tulip.holdObservers = function() {
  _holdObservers();
};

tulip.unholdObservers = function() {
  _unholdObservers();
};

// ==================================================================================================================

tulip.NodeShape = {
  Circle : 14,
  ChristmasTree : 28,
  Cone : 3,
  Cross : 8,
  Cube : 0,
  CubeOutlined : 1,
  CubeOutlinedTransparent : 9,
  Cylinder : 6,
  Diamond : 5,
  HalfCylinder : 10,
  Hexagon : 13,
  Pentagon : 12,
  Ring : 15,
  RoundedBox : 18,
  Sphere : 2,
  Square : 4,
  Triangle : 11,
  Star : 19,
  FontAwesomeIcon : 20,
  MaterialDesignIcon : 21
};

tulip.EdgeShape  = {
  Polyline : 0,
  BezierCurve : 4,
  CatmullRomCurve : 8,
  CubicBSplineCurve : 16
};

tulip.EdgeExtremityShape = {
  None : 1,
  Arrow : 50,
  Circle : 14,
  Cone : 3,
  Cross : 8,
  Cube : 0,
  CubeOutlinedTransparent : 9,
  Cylinder : 6,
  Diamond : 5,
  GlowSphere : 16,
  Hexagon : 13,
  Pentagon : 12,
  Ring : 15,
  Sphere : 2 ,
  Square : 4,
  Star : 19,
  FontAwesomeIcon : 20,
  MaterialDesignIcon : 21
};

tulip.FontAwesomeIcon = {
  Adjust : 'adjust',
  Adn : 'adn',
  AlignCenter : 'align-center',
  AlignJustify : 'align-justify',
  AlignLeft : 'align-left',
  AlignRight : 'align-right',
  Amazon : 'amazon',
  Ambulance : 'ambulance',
  Anchor : 'anchor',
  Android : 'android',
  Angellist : 'angellist',
  AngleDoubleDown : 'angle-double-down',
  AngleDoubleLeft : 'angle-double-left',
  AngleDoubleRight : 'angle-double-right',
  AngleDoubleUp : 'angle-double-up',
  AngleDown : 'angle-down',
  AngleLeft : 'angle-left',
  AngleRight : 'angle-right',
  AngleUp : 'angle-up',
  Apple : 'apple',
  Archive : 'archive',
  AreaChart : 'area-chart',
  ArrowCircleDown : 'arrow-circle-down',
  ArrowCircleLeft : 'arrow-circle-left',
  ArrowCircleODown : 'arrow-circle-o-down',
  ArrowCircleOLeft : 'arrow-circle-o-left',
  ArrowCircleORight : 'arrow-circle-o-right',
  ArrowCircleOUp : 'arrow-circle-o-up',
  ArrowCircleRight : 'arrow-circle-right',
  ArrowCircleUp : 'arrow-circle-up',
  ArrowDown : 'arrow-down',
  ArrowLeft : 'arrow-left',
  ArrowRight : 'arrow-right',
  ArrowUp : 'arrow-up',
  Arrows : 'arrows',
  ArrowsAlt : 'arrows-alt',
  ArrowsH : 'arrows-h',
  ArrowsV : 'arrows-v',
  Asterisk : 'asterisk',
  At : 'at',
  Automobile : 'automobile',
  Backward : 'backward',
  BalanceScale : 'balance-scale',
  Ban : 'ban',
  Bank : 'bank',
  BarChart : 'bar-chart',
  BarChartO : 'bar-chart-o',
  Barcode : 'barcode',
  Bars : 'bars',
  Battery0 : 'battery-0',
  Battery1 : 'battery-1',
  Battery2 : 'battery-2',
  Battery3 : 'battery-3',
  Battery4 : 'battery-4',
  BatteryEmpty : 'battery-empty',
  BatteryFull : 'battery-full',
  BatteryHalf : 'battery-half',
  BatteryQuarter : 'battery-quarter',
  BatteryThreeQuarters : 'battery-three-quarters',
  Bed : 'bed',
  Beer : 'beer',
  Behance : 'behance',
  BehanceSquare : 'behance-square',
  Bell : 'bell',
  BellO : 'bell-o',
  BellSlash : 'bell-slash',
  BellSlashO : 'bell-slash-o',
  Bicycle : 'bicycle',
  Binoculars : 'binoculars',
  BirthdayCake : 'birthday-cake',
  Bitbucket : 'bitbucket',
  BitbucketSquare : 'bitbucket-square',
  Bitcoin : 'bitcoin',
  BlackTie : 'black-tie',
  Bluetooth : 'bluetooth',
  BluetoothB : 'bluetooth-b',
  Bold : 'bold',
  Bolt : 'bolt',
  Bomb : 'bomb',
  Book : 'book',
  Bookmark : 'bookmark',
  BookmarkO : 'bookmark-o',
  Briefcase : 'briefcase',
  Btc : 'btc',
  Bug : 'bug',
  Building : 'building',
  BuildingO : 'building-o',
  Bullhorn : 'bullhorn',
  Bullseye : 'bullseye',
  Bus : 'bus',
  Buysellads : 'buysellads',
  Cab : 'cab',
  Calculator : 'calculator',
  Calendar : 'calendar',
  CalendarCheckO : 'calendar-check-o',
  CalendarMinusO : 'calendar-minus-o',
  CalendarO : 'calendar-o',
  CalendarPlusO : 'calendar-plus-o',
  CalendarTimesO : 'calendar-times-o',
  Camera : 'camera',
  CameraRetro : 'camera-retro',
  Car : 'car',
  CaretDown : 'caret-down',
  CaretLeft : 'caret-left',
  CaretRight : 'caret-right',
  CaretSquareODown : 'caret-square-o-down',
  CaretSquareOLeft : 'caret-square-o-left',
  CaretSquareORight : 'caret-square-o-right',
  CaretSquareOUp : 'caret-square-o-up',
  CaretUp : 'caret-up',
  CartArrowDown : 'cart-arrow-down',
  CartPlus : 'cart-plus',
  Cc : 'cc',
  CcAmex : 'cc-amex',
  CcDinersClub : 'cc-diners-club',
  CcDiscover : 'cc-discover',
  CcJcb : 'cc-jcb',
  CcMastercard : 'cc-mastercard',
  CcPaypal : 'cc-paypal',
  CcStripe : 'cc-stripe',
  CcVisa : 'cc-visa',
  Certificate : 'certificate',
  Chain : 'chain',
  ChainBroken : 'chain-broken',
  Check : 'check',
  CheckCircle : 'check-circle',
  CheckCircleO : 'check-circle-o',
  CheckSquare : 'check-square',
  CheckSquareO : 'check-square-o',
  ChevronCircleDown : 'chevron-circle-down',
  ChevronCircleLeft : 'chevron-circle-left',
  ChevronCircleRight : 'chevron-circle-right',
  ChevronCircleUp : 'chevron-circle-up',
  ChevronDown : 'chevron-down',
  ChevronLeft : 'chevron-left',
  ChevronRight : 'chevron-right',
  ChevronUp : 'chevron-up',
  Child : 'child',
  Chrome : 'chrome',
  Circle : 'circle',
  CircleO : 'circle-o',
  CircleONotch : 'circle-o-notch',
  CircleThin : 'circle-thin',
  Clipboard : 'clipboard',
  ClockO : 'clock-o',
  Clone : 'clone',
  Close : 'close',
  Cloud : 'cloud',
  CloudDownload : 'cloud-download',
  CloudUpload : 'cloud-upload',
  Cny : 'cny',
  Code : 'code',
  CodeFork : 'code-fork',
  Codepen : 'codepen',
  Codiepie : 'codiepie',
  Coffee : 'coffee',
  Cog : 'cog',
  Cogs : 'cogs',
  Columns : 'columns',
  Comment : 'comment',
  CommentO : 'comment-o',
  Commenting : 'commenting',
  CommentingO : 'commenting-o',
  Comments : 'comments',
  CommentsO : 'comments-o',
  Compass : 'compass',
  Compress : 'compress',
  Connectdevelop : 'connectdevelop',
  Contao : 'contao',
  Copy : 'copy',
  Copyright : 'copyright',
  CreativeCommons : 'creative-commons',
  CreditCard : 'credit-card',
  CreditCardAlt : 'credit-card-alt',
  Crop : 'crop',
  Crosshairs : 'crosshairs',
  Css3 : 'css3',
  Cube : 'cube',
  Cubes : 'cubes',
  Cut : 'cut',
  Cutlery : 'cutlery',
  Dashboard : 'dashboard',
  Dashcube : 'dashcube',
  Database : 'database',
  Dedent : 'dedent',
  Delicious : 'delicious',
  Desktop : 'desktop',
  Deviantart : 'deviantart',
  Diamond : 'diamond',
  Digg : 'digg',
  Dollar : 'dollar',
  DotCircleO : 'dot-circle-o',
  Download : 'download',
  Dribbble : 'dribbble',
  Dropbox : 'dropbox',
  Drupal : 'drupal',
  Edge : 'edge',
  Edit : 'edit',
  Eject : 'eject',
  EllipsisH : 'ellipsis-h',
  EllipsisV : 'ellipsis-v',
  Empire : 'empire',
  Envelope : 'envelope',
  EnvelopeO : 'envelope-o',
  EnvelopeSquare : 'envelope-square',
  Eraser : 'eraser',
  Eur : 'eur',
  Euro : 'euro',
  Exchange : 'exchange',
  Exclamation : 'exclamation',
  ExclamationCircle : 'exclamation-circle',
  ExclamationTriangle : 'exclamation-triangle',
  Expand : 'expand',
  Expeditedssl : 'expeditedssl',
  ExternalLink : 'external-link',
  ExternalLinkSquare : 'external-link-square',
  Eye : 'eye',
  EyeSlash : 'eye-slash',
  Eyedropper : 'eyedropper',
  Facebook : 'facebook',
  FacebookF : 'facebook-f',
  FacebookOfficial : 'facebook-official',
  FacebookSquare : 'facebook-square',
  FastBackward : 'fast-backward',
  FastForward : 'fast-forward',
  Fax : 'fax',
  Feed : 'feed',
  Female : 'female',
  FighterJet : 'fighter-jet',
  File : 'file',
  FileArchiveO : 'file-archive-o',
  FileAudioO : 'file-audio-o',
  FileCodeO : 'file-code-o',
  FileExcelO : 'file-excel-o',
  FileImageO : 'file-image-o',
  FileMovieO : 'file-movie-o',
  FileO : 'file-o',
  FilePdfO : 'file-pdf-o',
  FilePhotoO : 'file-photo-o',
  FilePictureO : 'file-picture-o',
  FilePowerpointO : 'file-powerpoint-o',
  FileSoundO : 'file-sound-o',
  FileText : 'file-text',
  FileTextO : 'file-text-o',
  FileVideoO : 'file-video-o',
  FileWordO : 'file-word-o',
  FileZipO : 'file-zip-o',
  FilesO : 'files-o',
  Film : 'film',
  Filter : 'filter',
  Fire : 'fire',
  FireExtinguisher : 'fire-extinguisher',
  Firefox : 'firefox',
  Flag : 'flag',
  FlagCheckered : 'flag-checkered',
  FlagO : 'flag-o',
  Flash : 'flash',
  Flask : 'flask',
  Flickr : 'flickr',
  FloppyO : 'floppy-o',
  Folder : 'folder',
  FolderO : 'folder-o',
  FolderOpen : 'folder-open',
  FolderOpenO : 'folder-open-o',
  Font : 'font',
  Fonticons : 'fonticons',
  FortAwesome : 'fort-awesome',
  Forumbee : 'forumbee',
  Forward : 'forward',
  Foursquare : 'foursquare',
  FrownO : 'frown-o',
  FutbolO : 'futbol-o',
  Gamepad : 'gamepad',
  Gavel : 'gavel',
  Gbp : 'gbp',
  Ge : 'ge',
  Gear : 'gear',
  Gears : 'gears',
  Genderless : 'genderless',
  GetPocket : 'get-pocket',
  Gg : 'gg',
  GgCircle : 'gg-circle',
  Gift : 'gift',
  Git : 'git',
  GitSquare : 'git-square',
  Github : 'github',
  GithubAlt : 'github-alt',
  GithubSquare : 'github-square',
  Gittip : 'gittip',
  Glass : 'glass',
  Globe : 'globe',
  Google : 'google',
  GooglePlus : 'google-plus',
  GooglePlusSquare : 'google-plus-square',
  GoogleWallet : 'google-wallet',
  GraduationCap : 'graduation-cap',
  Gratipay : 'gratipay',
  Group : 'group',
  HSquare : 'h-square',
  HackerNews : 'hacker-news',
  HandGrabO : 'hand-grab-o',
  HandLizardO : 'hand-lizard-o',
  HandODown : 'hand-o-down',
  HandOLeft : 'hand-o-left',
  HandORight : 'hand-o-right',
  HandOUp : 'hand-o-up',
  HandPaperO : 'hand-paper-o',
  HandPeaceO : 'hand-peace-o',
  HandPointerO : 'hand-pointer-o',
  HandRockO : 'hand-rock-o',
  HandScissorsO : 'hand-scissors-o',
  HandSpockO : 'hand-spock-o',
  HandStopO : 'hand-stop-o',
  Hashtag : 'hashtag',
  HddO : 'hdd-o',
  Header : 'header',
  Headphones : 'headphones',
  Heart : 'heart',
  HeartO : 'heart-o',
  Heartbeat : 'heartbeat',
  History : 'history',
  Home : 'home',
  HospitalO : 'hospital-o',
  Hotel : 'hotel',
  Hourglass : 'hourglass',
  Hourglass1 : 'hourglass-1',
  Hourglass2 : 'hourglass-2',
  Hourglass3 : 'hourglass-3',
  HourglassEnd : 'hourglass-end',
  HourglassHalf : 'hourglass-half',
  HourglassO : 'hourglass-o',
  HourglassStart : 'hourglass-start',
  Houzz : 'houzz',
  Html5 : 'html5',
  ICursor : 'i-cursor',
  Ils : 'ils',
  Image : 'image',
  Inbox : 'inbox',
  Indent : 'indent',
  Industry : 'industry',
  Info : 'info',
  InfoCircle : 'info-circle',
  Inr : 'inr',
  Instagram : 'instagram',
  Institution : 'institution',
  InternetExplorer : 'internet-explorer',
  Intersex : 'intersex',
  Ioxhost : 'ioxhost',
  Italic : 'italic',
  Joomla : 'joomla',
  Jpy : 'jpy',
  Jsfiddle : 'jsfiddle',
  Key : 'key',
  KeyboardO : 'keyboard-o',
  Krw : 'krw',
  Language : 'language',
  Laptop : 'laptop',
  Lastfm : 'lastfm',
  LastfmSquare : 'lastfm-square',
  Leaf : 'leaf',
  Leanpub : 'leanpub',
  Legal : 'legal',
  LemonO : 'lemon-o',
  LevelDown : 'level-down',
  LevelUp : 'level-up',
  LifeBouy : 'life-bouy',
  LifeBuoy : 'life-buoy',
  LifeRing : 'life-ring',
  LifeSaver : 'life-saver',
  LightbulbO : 'lightbulb-o',
  LineChart : 'line-chart',
  Link : 'link',
  Linkedin : 'linkedin',
  LinkedinSquare : 'linkedin-square',
  Linux : 'linux',
  List : 'list',
  ListAlt : 'list-alt',
  ListOl : 'list-ol',
  ListUl : 'list-ul',
  LocationArrow : 'location-arrow',
  Lock : 'lock',
  LongArrowDown : 'long-arrow-down',
  LongArrowLeft : 'long-arrow-left',
  LongArrowRight : 'long-arrow-right',
  LongArrowUp : 'long-arrow-up',
  Magic : 'magic',
  Magnet : 'magnet',
  MailForward : 'mail-forward',
  MailReply : 'mail-reply',
  MailReplyAll : 'mail-reply-all',
  Male : 'male',
  Map : 'map',
  MapMarker : 'map-marker',
  MapO : 'map-o',
  MapPin : 'map-pin',
  MapSigns : 'map-signs',
  Mars : 'mars',
  MarsDouble : 'mars-double',
  MarsStroke : 'mars-stroke',
  MarsStrokeH : 'mars-stroke-h',
  MarsStrokeV : 'mars-stroke-v',
  Maxcdn : 'maxcdn',
  Meanpath : 'meanpath',
  Medium : 'medium',
  Medkit : 'medkit',
  MehO : 'meh-o',
  Mercury : 'mercury',
  Microphone : 'microphone',
  MicrophoneSlash : 'microphone-slash',
  Minus : 'minus',
  MinusCircle : 'minus-circle',
  MinusSquare : 'minus-square',
  MinusSquareO : 'minus-square-o',
  Mixcloud : 'mixcloud',
  Mobile : 'mobile',
  MobilePhone : 'mobile-phone',
  Modx : 'modx',
  Money : 'money',
  MoonO : 'moon-o',
  MortarBoard : 'mortar-board',
  Motorcycle : 'motorcycle',
  MousePointer : 'mouse-pointer',
  Music : 'music',
  Navicon : 'navicon',
  Neuter : 'neuter',
  NewspaperO : 'newspaper-o',
  ObjectGroup : 'object-group',
  ObjectUngroup : 'object-ungroup',
  Odnoklassniki : 'odnoklassniki',
  OdnoklassnikiSquare : 'odnoklassniki-square',
  Opencart : 'opencart',
  Openid : 'openid',
  Opera : 'opera',
//  OptinMonster : "optin-monster",
  Outdent : 'outdent',
  Pagelines : 'pagelines',
  PaintBrush : 'paint-brush',
  PaperPlane : 'paper-plane',
  PaperPlaneO : 'paper-plane-o',
  Paperclip : 'paperclip',
  Paragraph : 'paragraph',
  Paste : 'paste',
  Pause : 'pause',
  PauseCircle : 'pause-circle',
  PauseCircleO : 'pause-circle-o',
  Paw : 'paw',
  Paypal : 'paypal',
  Pencil : 'pencil',
  PencilSquare : 'pencil-square',
  PencilSquareO : 'pencil-square-o',
  Percent : 'percent',
  Phone : 'phone',
  PhoneSquare : 'phone-square',
  Photo : 'photo',
  PictureO : 'picture-o',
  PieChart : 'pie-chart',
  PiedPiper : 'pied-piper',
  PiedPiperAlt : 'pied-piper-alt',
  Pinterest : 'pinterest',
  PinterestP : 'pinterest-p',
  PinterestSquare : 'pinterest-square',
  Plane : 'plane',
  Play : 'play',
  PlayCircle : 'play-circle',
  PlayCircleO : 'play-circle-o',
  Plug : 'plug',
  Plus : 'plus',
  PlusCircle : 'plus-circle',
  PlusSquare : 'plus-square',
  PlusSquareO : 'plus-square-o',
  PowerOff : 'power-off',
  Print : 'print',
  ProductHunt : 'product-hunt',
  PuzzlePiece : 'puzzle-piece',
  Px500 : '500px',
  Qq : 'qq',
  Qrcode : 'qrcode',
  Question : 'question',
  QuestionCircle : 'question-circle',
  QuoteLeft : 'quote-left',
  QuoteRight : 'quote-right',
  Ra : 'ra',
  Random : 'random',
  Rebel : 'rebel',
  Recycle : 'recycle',
  Reddit : 'reddit',
  RedditAlien : 'reddit-alien',
  RedditSquare : 'reddit-square',
  Refresh : 'refresh',
  Registered : 'registered',
  Remove : 'remove',
  Renren : 'renren',
  Reorder : 'reorder',
  Repeat : 'repeat',
  Reply : 'reply',
  ReplyAll : 'reply-all',
  Retweet : 'retweet',
  Rmb : 'rmb',
  Road : 'road',
  Rocket : 'rocket',
  RotateLeft : 'rotate-left',
  RotateRight : 'rotate-right',
  Rouble : 'rouble',
  Rss : 'rss',
  RssSquare : 'rss-square',
  Rub : 'rub',
  Ruble : 'ruble',
  Rupee : 'rupee',
  Safari : 'safari',
  Save : 'save',
  Scissors : 'scissors',
  Scribd : 'scribd',
  Search : 'search',
  SearchMinus : 'search-minus',
  SearchPlus : 'search-plus',
  Sellsy : 'sellsy',
  Send : 'send',
  SendO : 'send-o',
  Server : 'server',
  Share : 'share',
  ShareAlt : 'share-alt',
  ShareAltSquare : 'share-alt-square',
  ShareSquare : 'share-square',
  ShareSquareO : 'share-square-o',
  Shekel : 'shekel',
  Sheqel : 'sheqel',
  Shield : 'shield',
  Ship : 'ship',
  Shirtsinbulk : 'shirtsinbulk',
  ShoppingBag : 'shopping-bag',
  ShoppingBasket : 'shopping-basket',
  ShoppingCart : 'shopping-cart',
  SignIn : 'sign-in',
  SignOut : 'sign-out',
  Signal : 'signal',
  Simplybuilt : 'simplybuilt',
  Sitemap : 'sitemap',
  Skyatlas : 'skyatlas',
  Skype : 'skype',
  Slack : 'slack',
  Sliders : 'sliders',
  Slideshare : 'slideshare',
  SmileO : 'smile-o',
  SoccerBallO : 'soccer-ball-o',
  Sort : 'sort',
  SortAlphaAsc : 'sort-alpha-asc',
  SortAlphaDesc : 'sort-alpha-desc',
  SortAmountAsc : 'sort-amount-asc',
  SortAmountDesc : 'sort-amount-desc',
  SortAsc : 'sort-asc',
  SortDesc : 'sort-desc',
  SortDown : 'sort-down',
  SortNumericAsc : 'sort-numeric-asc',
  SortNumericDesc : 'sort-numeric-desc',
  SortUp : 'sort-up',
  Soundcloud : 'soundcloud',
  SpaceShuttle : 'space-shuttle',
  Spinner : 'spinner',
  Spoon : 'spoon',
  Spotify : 'spotify',
  Square : 'square',
  SquareO : 'square-o',
  StackExchange : 'stack-exchange',
  StackOverflow : 'stack-overflow',
  Star : 'star',
  StarHalf : 'star-half',
  StarHalfEmpty : 'star-half-empty',
  StarHalfFull : 'star-half-full',
  StarHalfO : 'star-half-o',
  StarO : 'star-o',
  Steam : 'steam',
  SteamSquare : 'steam-square',
  StepBackward : 'step-backward',
  StepForward : 'step-forward',
  Stethoscope : 'stethoscope',
  StickyNote : 'sticky-note',
  StickyNoteO : 'sticky-note-o',
  Stop : 'stop',
  StopCircle : 'stop-circle',
  StopCircleO : 'stop-circle-o',
  StreetView : 'street-view',
  Strikethrough : 'strikethrough',
  Stumbleupon : 'stumbleupon',
  StumbleuponCircle : 'stumbleupon-circle',
  Subscript : 'subscript',
  Subway : 'subway',
  Suitcase : 'suitcase',
  SunO : 'sun-o',
  Superscript : 'superscript',
  Support : 'support',
  Table : 'table',
  Tablet : 'tablet',
  Tachometer : 'tachometer',
  Tag : 'tag',
  Tags : 'tags',
  Tasks : 'tasks',
  Taxi : 'taxi',
  Television : 'television',
  TencentWeibo : 'tencent-weibo',
  Terminal : 'terminal',
  TextHeight : 'text-height',
  TextWidth : 'text-width',
  Th : 'th',
  ThLarge : 'th-large',
  ThList : 'th-list',
  ThumbTack : 'thumb-tack',
  ThumbsDown : 'thumbs-down',
  ThumbsODown : 'thumbs-o-down',
  ThumbsOUp : 'thumbs-o-up',
  ThumbsUp : 'thumbs-up',
  Ticket : 'ticket',
  Times : 'times',
  TimesCircle : 'times-circle',
  TimesCircleO : 'times-circle-o',
  Tint : 'tint',
  ToggleDown : 'toggle-down',
  ToggleLeft : 'toggle-left',
  ToggleOff : 'toggle-off',
  ToggleOn : 'toggle-on',
  ToggleRight : 'toggle-right',
  ToggleUp : 'toggle-up',
  Trademark : 'trademark',
  Train : 'train',
  Transgender : 'transgender',
  TransgenderAlt : 'transgender-alt',
  Trash : 'trash',
  TrashO : 'trash-o',
  Tree : 'tree',
  Trello : 'trello',
  Tripadvisor : 'tripadvisor',
  Trophy : 'trophy',
  Truck : 'truck',
  Try : 'try',
  Tty : 'tty',
  Tumblr : 'tumblr',
  TumblrSquare : 'tumblr-square',
  TurkishLira : 'turkish-lira',
  Tv : 'tv',
  Twitch : 'twitch',
  Twitter : 'twitter',
  TwitterSquare : 'twitter-square',
  Umbrella : 'umbrella',
  Underline : 'underline',
  Undo : 'undo',
  University : 'university',
  Unlink : 'unlink',
  Unlock : 'unlock',
  UnlockAlt : 'unlock-alt',
  Unsorted : 'unsorted',
  Upload : 'upload',
  Usb : 'usb',
  Usd : 'usd',
  User : 'user',
  UserMd : 'user-md',
  UserPlus : 'user-plus',
  UserSecret : 'user-secret',
  UserTimes : 'user-times',
  Users : 'users',
  Venus : 'venus',
  VenusDouble : 'venus-double',
  VenusMars : 'venus-mars',
  Viacoin : 'viacoin',
  VideoCamera : 'video-camera',
  Vimeo : 'vimeo',
  VimeoSquare : 'vimeo-square',
  Vine : 'vine',
  Vk : 'vk',
  VolumeDown : 'volume-down',
  VolumeOff : 'volume-off',
  VolumeUp : 'volume-up',
  Warning : 'warning',
  Wechat : 'wechat',
  Weibo : 'weibo',
  Weixin : 'weixin',
  Whatsapp : 'whatsapp',
  Wheelchair : 'wheelchair',
  Wifi : 'wifi',
  WikipediaW : 'wikipedia-w',
  Windows : 'windows',
  Won : 'won',
  Wordpress : 'wordpress',
  Wrench : 'wrench',
  Xing : 'xing',
  XingSquare : 'xing-square',
  YCombinator : 'y-combinator',
  YCombinatorSquare : 'y-combinator-square',
  Yahoo : 'yahoo',
  Yc : 'yc',
  YcSquare : 'yc-square',
  Yelp : 'yelp',
  Yen : 'yen',
  Youtube : 'youtube',
  YoutubePlay : 'youtube-play',
  YoutubeSquare : 'youtube-square'

};

tulip.MaterialDesignIcons = {
  AccessPoint : 'access-point',
  AccessPointNetwork : 'access-point-network',
  Account : 'account',
  AccountAlert : 'account-alert',
  AccountBox : 'account-box',
  AccountBoxOutline : 'account-box-outline',
  AccountCardDetails : 'account-card-details',
  AccountCheck : 'account-check',
  AccountCircle : 'account-circle',
  AccountConvert : 'account-convert',
  AccountKey : 'account-key',
  AccountLocation : 'account-location',
  AccountMinus : 'account-minus',
  AccountMultiple : 'account-multiple',
  AccountMultipleMinus : 'account-multiple-minus',
  AccountMultipleOutline : 'account-multiple-outline',
  AccountMultiplePlus : 'account-multiple-plus',
  AccountNetwork : 'account-network',
  AccountOff : 'account-off',
  AccountOutline : 'account-outline',
  AccountPlus : 'account-plus',
  AccountRemove : 'account-remove',
  AccountSearch : 'account-search',
  AccountSettings : 'account-settings',
  AccountSettingsVariant : 'account-settings-variant',
  AccountStar : 'account-star',
  AccountStarVariant : 'account-star-variant',
  AccountSwitch : 'account-switch',
  Adjust : 'adjust',
  AirConditioner : 'air-conditioner',
  Airballoon : 'airballoon',
  Airplane : 'airplane',
  AirplaneLanding : 'airplane-landing',
  AirplaneOff : 'airplane-off',
  AirplaneTakeoff : 'airplane-takeoff',
  Airplay : 'airplay',
  Alarm : 'alarm',
  AlarmCheck : 'alarm-check',
  AlarmMultiple : 'alarm-multiple',
  AlarmOff : 'alarm-off',
  AlarmPlus : 'alarm-plus',
  AlarmSnooze : 'alarm-snooze',
  Album : 'album',
  Alert : 'alert',
  AlertBox : 'alert-box',
  AlertCircle : 'alert-circle',
  AlertCircleOutline : 'alert-circle-outline',
  AlertOctagon : 'alert-octagon',
  AlertOutline : 'alert-outline',
  Alpha : 'alpha',
  Alphabetical : 'alphabetical',
  Altimeter : 'altimeter',
  Amazon : 'amazon',
  AmazonClouddrive : 'amazon-clouddrive',
  Ambulance : 'ambulance',
  Amplifier : 'amplifier',
  Anchor : 'anchor',
  Android : 'android',
  AndroidDebugBridge : 'android-debug-bridge',
  AndroidStudio : 'android-studio',
  Angular : 'angular',
  Animation : 'animation',
  Apple : 'apple',
  AppleFinder : 'apple-finder',
  AppleIos : 'apple-ios',
  AppleKeyboardCaps : 'apple-keyboard-caps',
  AppleKeyboardCommand : 'apple-keyboard-command',
  AppleKeyboardControl : 'apple-keyboard-control',
  AppleKeyboardOption : 'apple-keyboard-option',
  AppleKeyboardShift : 'apple-keyboard-shift',
  AppleMobileme : 'apple-mobileme',
  AppleSafari : 'apple-safari',
  Application : 'application',
  Appnet : 'appnet',
  Apps : 'apps',
  Archive : 'archive',
  ArrangeBringForward : 'arrange-bring-forward',
  ArrangeBringToFront : 'arrange-bring-to-front',
  ArrangeSendBackward : 'arrange-send-backward',
  ArrangeSendToBack : 'arrange-send-to-back',
  ArrowAll : 'arrow-all',
  ArrowBottomLeft : 'arrow-bottom-left',
  ArrowBottomRight : 'arrow-bottom-right',
  ArrowCompress : 'arrow-compress',
  ArrowCompressAll : 'arrow-compress-all',
  ArrowDown : 'arrow-down',
  ArrowDownBold : 'arrow-down-bold',
  ArrowDownBoldCircle : 'arrow-down-bold-circle',
  ArrowDownBoldCircleOutline : 'arrow-down-bold-circle-outline',
  ArrowDownBoldHexagonOutline : 'arrow-down-bold-hexagon-outline',
  ArrowDownDropCircle : 'arrow-down-drop-circle',
  ArrowDownDropCircleOutline : 'arrow-down-drop-circle-outline',
  ArrowExpand : 'arrow-expand',
  ArrowExpandAll : 'arrow-expand-all',
  ArrowLeft : 'arrow-left',
  ArrowLeftBold : 'arrow-left-bold',
  ArrowLeftBoldCircle : 'arrow-left-bold-circle',
  ArrowLeftBoldCircleOutline : 'arrow-left-bold-circle-outline',
  ArrowLeftBoldHexagonOutline : 'arrow-left-bold-hexagon-outline',
  ArrowLeftDropCircle : 'arrow-left-drop-circle',
  ArrowLeftDropCircleOutline : 'arrow-left-drop-circle-outline',
  ArrowRight : 'arrow-right',
  ArrowRightBold : 'arrow-right-bold',
  ArrowRightBoldCircle : 'arrow-right-bold-circle',
  ArrowRightBoldCircleOutline : 'arrow-right-bold-circle-outline',
  ArrowRightBoldHexagonOutline : 'arrow-right-bold-hexagon-outline',
  ArrowRightDropCircle : 'arrow-right-drop-circle',
  ArrowRightDropCircleOutline : 'arrow-right-drop-circle-outline',
  ArrowTopLeft : 'arrow-top-left',
  ArrowTopRight : 'arrow-top-right',
  ArrowUp : 'arrow-up',
  ArrowUpBold : 'arrow-up-bold',
  ArrowUpBoldCircle : 'arrow-up-bold-circle',
  ArrowUpBoldCircleOutline : 'arrow-up-bold-circle-outline',
  ArrowUpBoldHexagonOutline : 'arrow-up-bold-hexagon-outline',
  ArrowUpDropCircle : 'arrow-up-drop-circle',
  ArrowUpDropCircleOutline : 'arrow-up-drop-circle-outline',
  Assistant : 'assistant',
  At : 'at',
  Attachment : 'attachment',
  Audiobook : 'audiobook',
  AutoFix : 'auto-fix',
  AutoUpload : 'auto-upload',
  Autorenew : 'autorenew',
  AvTimer : 'av-timer',
  Baby : 'baby',
  BabyBuggy : 'baby-buggy',
  Backburger : 'backburger',
  Backspace : 'backspace',
  BackupRestore : 'backup-restore',
  Bandcamp : 'bandcamp',
  Bank : 'bank',
  Barcode : 'barcode',
  BarcodeScan : 'barcode-scan',
  Barley : 'barley',
  Barrel : 'barrel',
  Basecamp : 'basecamp',
  Basket : 'basket',
  BasketFill : 'basket-fill',
  BasketUnfill : 'basket-unfill',
  Battery : 'battery',
  Battery10 : 'battery-10',
  Battery20 : 'battery-20',
  Battery30 : 'battery-30',
  Battery40 : 'battery-40',
  Battery50 : 'battery-50',
  Battery60 : 'battery-60',
  Battery70 : 'battery-70',
  Battery80 : 'battery-80',
  Battery90 : 'battery-90',
  BatteryAlert : 'battery-alert',
  BatteryCharging : 'battery-charging',
  BatteryCharging100 : 'battery-charging-100',
  BatteryCharging20 : 'battery-charging-20',
  BatteryCharging30 : 'battery-charging-30',
  BatteryCharging40 : 'battery-charging-40',
  BatteryCharging60 : 'battery-charging-60',
  BatteryCharging80 : 'battery-charging-80',
  BatteryCharging90 : 'battery-charging-90',
  BatteryMinus : 'battery-minus',
  BatteryNegative : 'battery-negative',
  BatteryOutline : 'battery-outline',
  BatteryPlus : 'battery-plus',
  BatteryPositive : 'battery-positive',
  BatteryUnknown : 'battery-unknown',
  Beach : 'beach',
  Beaker : 'beaker',
  Beats : 'beats',
  Beer : 'beer',
  Behance : 'behance',
  Bell : 'bell',
  BellOff : 'bell-off',
  BellOutline : 'bell-outline',
  BellPlus : 'bell-plus',
  BellRing : 'bell-ring',
  BellRingOutline : 'bell-ring-outline',
  BellSleep : 'bell-sleep',
  Beta : 'beta',
  Bible : 'bible',
  Bike : 'bike',
  Bing : 'bing',
  Binoculars : 'binoculars',
  Bio : 'bio',
  Biohazard : 'biohazard',
  Bitbucket : 'bitbucket',
  BlackMesa : 'black-mesa',
  Blackberry : 'blackberry',
  Blender : 'blender',
  Blinds : 'blinds',
  BlockHelper : 'block-helper',
  Blogger : 'blogger',
  Bluetooth : 'bluetooth',
  BluetoothAudio : 'bluetooth-audio',
  BluetoothConnect : 'bluetooth-connect',
  BluetoothOff : 'bluetooth-off',
  BluetoothSettings : 'bluetooth-settings',
  BluetoothTransfer : 'bluetooth-transfer',
  Blur : 'blur',
  BlurLinear : 'blur-linear',
  BlurOff : 'blur-off',
  BlurRadial : 'blur-radial',
  Bomb : 'bomb',
  Bone : 'bone',
  Book : 'book',
  BookMinus : 'book-minus',
  BookMultiple : 'book-multiple',
  BookMultipleVariant : 'book-multiple-variant',
  BookOpen : 'book-open',
  BookOpenPageVariant : 'book-open-page-variant',
  BookOpenVariant : 'book-open-variant',
  BookPlus : 'book-plus',
  BookVariant : 'book-variant',
  Bookmark : 'bookmark',
  BookmarkCheck : 'bookmark-check',
  BookmarkMusic : 'bookmark-music',
  BookmarkOutline : 'bookmark-outline',
  BookmarkPlus : 'bookmark-plus',
  BookmarkPlusOutline : 'bookmark-plus-outline',
  BookmarkRemove : 'bookmark-remove',
  Boombox : 'boombox',
  BorderAll : 'border-all',
  BorderBottom : 'border-bottom',
  BorderColor : 'border-color',
  BorderHorizontal : 'border-horizontal',
  BorderInside : 'border-inside',
  BorderLeft : 'border-left',
  BorderNone : 'border-none',
  BorderOutside : 'border-outside',
  BorderRight : 'border-right',
  BorderStyle : 'border-style',
  BorderTop : 'border-top',
  BorderVertical : 'border-vertical',
  BowTie : 'bow-tie',
  Bowl : 'bowl',
  Bowling : 'bowling',
  Box : 'box',
  BoxCutter : 'box-cutter',
  BoxShadow : 'box-shadow',
  Bridge : 'bridge',
  Briefcase : 'briefcase',
  BriefcaseCheck : 'briefcase-check',
  BriefcaseDownload : 'briefcase-download',
  BriefcaseUpload : 'briefcase-upload',
  Brightness1 : 'brightness-1',
  Brightness2 : 'brightness-2',
  Brightness3 : 'brightness-3',
  Brightness4 : 'brightness-4',
  Brightness5 : 'brightness-5',
  Brightness6 : 'brightness-6',
  Brightness7 : 'brightness-7',
  BrightnessAuto : 'brightness-auto',
  Broom : 'broom',
  Brush : 'brush',
  Buffer : 'buffer',
  Bug : 'bug',
  BulletinBoard : 'bulletin-board',
  Bullhorn : 'bullhorn',
  Bullseye : 'bullseye',
  BurstMode : 'burst-mode',
  Bus : 'bus',
  Cached : 'cached',
  Cake : 'cake',
  CakeLayered : 'cake-layered',
  CakeVariant : 'cake-variant',
  Calculator : 'calculator',
  Calendar : 'calendar',
  CalendarBlank : 'calendar-blank',
  CalendarCheck : 'calendar-check',
  CalendarClock : 'calendar-clock',
  CalendarMultiple : 'calendar-multiple',
  CalendarMultipleCheck : 'calendar-multiple-check',
  CalendarPlus : 'calendar-plus',
  CalendarQuestion : 'calendar-question',
  CalendarRange : 'calendar-range',
  CalendarRemove : 'calendar-remove',
  CalendarText : 'calendar-text',
  CalendarToday : 'calendar-today',
  CallMade : 'call-made',
  CallMerge : 'call-merge',
  CallMissed : 'call-missed',
  CallReceived : 'call-received',
  CallSplit : 'call-split',
  Camcorder : 'camcorder',
  CamcorderBox : 'camcorder-box',
  CamcorderBoxOff : 'camcorder-box-off',
  CamcorderOff : 'camcorder-off',
  Camera : 'camera',
  CameraBurst : 'camera-burst',
  CameraEnhance : 'camera-enhance',
  CameraFront : 'camera-front',
  CameraFrontVariant : 'camera-front-variant',
  CameraIris : 'camera-iris',
  CameraOff : 'camera-off',
  CameraPartyMode : 'camera-party-mode',
  CameraRear : 'camera-rear',
  CameraRearVariant : 'camera-rear-variant',
  CameraSwitch : 'camera-switch',
  CameraTimer : 'camera-timer',
  Candle : 'candle',
  Candycane : 'candycane',
  Car : 'car',
  CarBattery : 'car-battery',
  CarConnected : 'car-connected',
  CarWash : 'car-wash',
  Cards : 'cards',
  CardsOutline : 'cards-outline',
  CardsPlayingOutline : 'cards-playing-outline',
  Carrot : 'carrot',
  Cart : 'cart',
  CartOff : 'cart-off',
  CartOutline : 'cart-outline',
  CartPlus : 'cart-plus',
  CaseSensitiveAlt : 'case-sensitive-alt',
  Cash : 'cash',
  Cash100 : 'cash-100',
  CashMultiple : 'cash-multiple',
  CashUsd : 'cash-usd',
  Cast : 'cast',
  CastConnected : 'cast-connected',
  Castle : 'castle',
  Cat : 'cat',
  Cellphone : 'cellphone',
  CellphoneAndroid : 'cellphone-android',
  CellphoneBasic : 'cellphone-basic',
  CellphoneDock : 'cellphone-dock',
  CellphoneIphone : 'cellphone-iphone',
  CellphoneLink : 'cellphone-link',
  CellphoneLinkOff : 'cellphone-link-off',
  CellphoneSettings : 'cellphone-settings',
  Certificate : 'certificate',
  ChairSchool : 'chair-school',
  ChartArc : 'chart-arc',
  ChartAreaspline : 'chart-areaspline',
  ChartBar : 'chart-bar',
  ChartBubble : 'chart-bubble',
  ChartGantt : 'chart-gantt',
  ChartHistogram : 'chart-histogram',
  ChartLine : 'chart-line',
  ChartPie : 'chart-pie',
  ChartScatterplotHexbin : 'chart-scatterplot-hexbin',
  ChartTimeline : 'chart-timeline',
  Check : 'check',
  CheckAll : 'check-all',
  CheckCircle : 'check-circle',
  CheckCircleOutline : 'check-circle-outline',
  CheckboxBlank : 'checkbox-blank',
  CheckboxBlankCircle : 'checkbox-blank-circle',
  CheckboxBlankCircleOutline : 'checkbox-blank-circle-outline',
  CheckboxBlankOutline : 'checkbox-blank-outline',
  CheckboxMarked : 'checkbox-marked',
  CheckboxMarkedCircle : 'checkbox-marked-circle',
  CheckboxMarkedCircleOutline : 'checkbox-marked-circle-outline',
  CheckboxMarkedOutline : 'checkbox-marked-outline',
  CheckboxMultipleBlank : 'checkbox-multiple-blank',
  CheckboxMultipleBlankCircle : 'checkbox-multiple-blank-circle',
  CheckboxMultipleBlankCircleOutline : 'checkbox-multiple-blank-circle-outline',
  CheckboxMultipleBlankOutline : 'checkbox-multiple-blank-outline',
  CheckboxMultipleMarked : 'checkbox-multiple-marked',
  CheckboxMultipleMarkedCircle : 'checkbox-multiple-marked-circle',
  CheckboxMultipleMarkedCircleOutline : 'checkbox-multiple-marked-circle-outline',
  CheckboxMultipleMarkedOutline : 'checkbox-multiple-marked-outline',
  Checkerboard : 'checkerboard',
  ChemicalWeapon : 'chemical-weapon',
  ChevronDoubleDown : 'chevron-double-down',
  ChevronDoubleLeft : 'chevron-double-left',
  ChevronDoubleRight : 'chevron-double-right',
  ChevronDoubleUp : 'chevron-double-up',
  ChevronDown : 'chevron-down',
  ChevronLeft : 'chevron-left',
  ChevronRight : 'chevron-right',
  ChevronUp : 'chevron-up',
  Chip : 'chip',
  Church : 'church',
  CiscoWebex : 'cisco-webex',
  City : 'city',
  Clipboard : 'clipboard',
  ClipboardAccount : 'clipboard-account',
  ClipboardAlert : 'clipboard-alert',
  ClipboardArrowDown : 'clipboard-arrow-down',
  ClipboardArrowLeft : 'clipboard-arrow-left',
  ClipboardCheck : 'clipboard-check',
  ClipboardOutline : 'clipboard-outline',
  ClipboardText : 'clipboard-text',
  Clippy : 'clippy',
  Clock : 'clock',
  ClockAlert : 'clock-alert',
  ClockEnd : 'clock-end',
  ClockFast : 'clock-fast',
  ClockIn : 'clock-in',
  ClockOut : 'clock-out',
  ClockStart : 'clock-start',
  Close : 'close',
  CloseBox : 'close-box',
  CloseBoxOutline : 'close-box-outline',
  CloseCircle : 'close-circle',
  CloseCircleOutline : 'close-circle-outline',
  CloseNetwork : 'close-network',
  CloseOctagon : 'close-octagon',
  CloseOctagonOutline : 'close-octagon-outline',
  ClosedCaption : 'closed-caption',
  Cloud : 'cloud',
  CloudCheck : 'cloud-check',
  CloudCircle : 'cloud-circle',
  CloudDownload : 'cloud-download',
  CloudOutline : 'cloud-outline',
  CloudOutlineOff : 'cloud-outline-off',
  CloudPrint : 'cloud-print',
  CloudPrintOutline : 'cloud-print-outline',
  CloudSync : 'cloud-sync',
  CloudUpload : 'cloud-upload',
  CodeArray : 'code-array',
  CodeBraces : 'code-braces',
  CodeBrackets : 'code-brackets',
  CodeEqual : 'code-equal',
  CodeGreaterThan : 'code-greater-than',
  CodeGreaterThanOrEqual : 'code-greater-than-or-equal',
  CodeLessThan : 'code-less-than',
  CodeLessThanOrEqual : 'code-less-than-or-equal',
  CodeNotEqual : 'code-not-equal',
  CodeNotEqualVariant : 'code-not-equal-variant',
  CodeParentheses : 'code-parentheses',
  CodeString : 'code-string',
  CodeTags : 'code-tags',
  CodeTagsCheck : 'code-tags-check',
  Codepen : 'codepen',
  Coffee : 'coffee',
  CoffeeToGo : 'coffee-to-go',
  Coin : 'coin',
  Coins : 'coins',
  Collage : 'collage',
  ColorHelper : 'color-helper',
  Comment : 'comment',
  CommentAccount : 'comment-account',
  CommentAccountOutline : 'comment-account-outline',
  CommentAlert : 'comment-alert',
  CommentAlertOutline : 'comment-alert-outline',
  CommentCheck : 'comment-check',
  CommentCheckOutline : 'comment-check-outline',
  CommentMultipleOutline : 'comment-multiple-outline',
  CommentOutline : 'comment-outline',
  CommentPlusOutline : 'comment-plus-outline',
  CommentProcessing : 'comment-processing',
  CommentProcessingOutline : 'comment-processing-outline',
  CommentQuestionOutline : 'comment-question-outline',
  CommentRemoveOutline : 'comment-remove-outline',
  CommentText : 'comment-text',
  CommentTextOutline : 'comment-text-outline',
  Compare : 'compare',
  Compass : 'compass',
  CompassOutline : 'compass-outline',
  Console : 'console',
  ContactMail : 'contact-mail',
  ContentCopy : 'content-copy',
  ContentCut : 'content-cut',
  ContentDuplicate : 'content-duplicate',
  ContentPaste : 'content-paste',
  ContentSave : 'content-save',
  ContentSaveAll : 'content-save-all',
  ContentSaveSettings : 'content-save-settings',
  Contrast : 'contrast',
  ContrastBox : 'contrast-box',
  ContrastCircle : 'contrast-circle',
  Cookie : 'cookie',
  Copyright : 'copyright',
  Counter : 'counter',
  Cow : 'cow',
  Creation : 'creation',
  CreditCard : 'credit-card',
  CreditCardMultiple : 'credit-card-multiple',
  CreditCardOff : 'credit-card-off',
  CreditCardPlus : 'credit-card-plus',
  CreditCardScan : 'credit-card-scan',
  Crop : 'crop',
  CropFree : 'crop-free',
  CropLandscape : 'crop-landscape',
  CropPortrait : 'crop-portrait',
  CropRotate : 'crop-rotate',
  CropSquare : 'crop-square',
  Crosshairs : 'crosshairs',
  CrosshairsGps : 'crosshairs-gps',
  Crown : 'crown',
  Cube : 'cube',
  CubeOutline : 'cube-outline',
  CubeSend : 'cube-send',
  CubeUnfolded : 'cube-unfolded',
  Cup : 'cup',
  CupOff : 'cup-off',
  CupWater : 'cup-water',
  CurrencyBtc : 'currency-btc',
  CurrencyEur : 'currency-eur',
  CurrencyGbp : 'currency-gbp',
  CurrencyInr : 'currency-inr',
  CurrencyNgn : 'currency-ngn',
  CurrencyRub : 'currency-rub',
  CurrencyTry : 'currency-try',
  CurrencyUsd : 'currency-usd',
  CurrencyUsdOff : 'currency-usd-off',
  CursorDefault : 'cursor-default',
  CursorDefaultOutline : 'cursor-default-outline',
  CursorMove : 'cursor-move',
  CursorPointer : 'cursor-pointer',
  CursorText : 'cursor-text',
  Database : 'database',
  DatabaseMinus : 'database-minus',
  DatabasePlus : 'database-plus',
  DebugStepInto : 'debug-step-into',
  DebugStepOut : 'debug-step-out',
  DebugStepOver : 'debug-step-over',
  DecimalDecrease : 'decimal-decrease',
  DecimalIncrease : 'decimal-increase',
  Delete : 'delete',
  DeleteCircle : 'delete-circle',
  DeleteForever : 'delete-forever',
  DeleteSweep : 'delete-sweep',
  DeleteVariant : 'delete-variant',
  Delta : 'delta',
  Deskphone : 'deskphone',
  DesktopMac : 'desktop-mac',
  DesktopTower : 'desktop-tower',
  Details : 'details',
  DeveloperBoard : 'developer-board',
  Deviantart : 'deviantart',
  Dialpad : 'dialpad',
  Diamond : 'diamond',
  Dice1 : 'dice-1',
  Dice2 : 'dice-2',
  Dice3 : 'dice-3',
  Dice4 : 'dice-4',
  Dice5 : 'dice-5',
  Dice6 : 'dice-6',
  DiceD20 : 'dice-d20',
  DiceD4 : 'dice-d4',
  DiceD6 : 'dice-d6',
  DiceD8 : 'dice-d8',
  Dictionary : 'dictionary',
  Directions : 'directions',
  DirectionsFork : 'directions-fork',
  Discord : 'discord',
  Disk : 'disk',
  DiskAlert : 'disk-alert',
  Disqus : 'disqus',
  DisqusOutline : 'disqus-outline',
  Division : 'division',
  DivisionBox : 'division-box',
  Dna : 'dna',
  Dns : 'dns',
  DoNotDisturb : 'do-not-disturb',
  DoNotDisturbOff : 'do-not-disturb-off',
  Dolby : 'dolby',
  Domain : 'domain',
  DotsHorizontal : 'dots-horizontal',
  DotsVertical : 'dots-vertical',
  Douban : 'douban',
  Download : 'download',
  Drag : 'drag',
  DragHorizontal : 'drag-horizontal',
  DragVertical : 'drag-vertical',
  Drawing : 'drawing',
  DrawingBox : 'drawing-box',
  Dribbble : 'dribbble',
  DribbbleBox : 'dribbble-box',
  Drone : 'drone',
  Dropbox : 'dropbox',
  Drupal : 'drupal',
  Duck : 'duck',
  Dumbbell : 'dumbbell',
  Earth : 'earth',
  EarthOff : 'earth-off',
  Edge : 'edge',
  Eject : 'eject',
  ElevationDecline : 'elevation-decline',
  ElevationRise : 'elevation-rise',
  Elevator : 'elevator',
  Email : 'email',
  EmailOpen : 'email-open',
  EmailOpenOutline : 'email-open-outline',
  EmailOutline : 'email-outline',
  EmailSecure : 'email-secure',
  EmailVariant : 'email-variant',
  Emby : 'emby',
  Emoticon : 'emoticon',
  EmoticonCool : 'emoticon-cool',
  EmoticonDead : 'emoticon-dead',
  EmoticonDevil : 'emoticon-devil',
  EmoticonExcited : 'emoticon-excited',
  EmoticonHappy : 'emoticon-happy',
  EmoticonNeutral : 'emoticon-neutral',
  EmoticonPoop : 'emoticon-poop',
  EmoticonSad : 'emoticon-sad',
  EmoticonTongue : 'emoticon-tongue',
  Engine : 'engine',
  EngineOutline : 'engine-outline',
  Equal : 'equal',
  EqualBox : 'equal-box',
  Eraser : 'eraser',
  EraserVariant : 'eraser-variant',
  Escalator : 'escalator',
  Ethernet : 'ethernet',
  EthernetCable : 'ethernet-cable',
  EthernetCableOff : 'ethernet-cable-off',
  Etsy : 'etsy',
  EvStation : 'ev-station',
  Evernote : 'evernote',
  Exclamation : 'exclamation',
  ExitToApp : 'exit-to-app',
  Export : 'export',
  Eye : 'eye',
  EyeOff : 'eye-off',
  Eyedropper : 'eyedropper',
  EyedropperVariant : 'eyedropper-variant',
  Face : 'face',
  FaceProfile : 'face-profile',
  Facebook : 'facebook',
  FacebookBox : 'facebook-box',
  FacebookMessenger : 'facebook-messenger',
  Factory : 'factory',
  Fan : 'fan',
  FastForward : 'fast-forward',
  Fax : 'fax',
  Ferry : 'ferry',
  File : 'file',
  FileChart : 'file-chart',
  FileCheck : 'file-check',
  FileCloud : 'file-cloud',
  FileDelimited : 'file-delimited',
  FileDocument : 'file-document',
  FileDocumentBox : 'file-document-box',
  FileExcel : 'file-excel',
  FileExcelBox : 'file-excel-box',
  FileExport : 'file-export',
  FileFind : 'file-find',
  FileHidden : 'file-hidden',
  FileImage : 'file-image',
  FileImport : 'file-import',
  FileLock : 'file-lock',
  FileMultiple : 'file-multiple',
  FileMusic : 'file-music',
  FileOutline : 'file-outline',
  FilePdf : 'file-pdf',
  FilePdfBox : 'file-pdf-box',
  FilePowerpoint : 'file-powerpoint',
  FilePowerpointBox : 'file-powerpoint-box',
  FilePresentationBox : 'file-presentation-box',
  FileRestore : 'file-restore',
  FileSend : 'file-send',
  FileTree : 'file-tree',
  FileVideo : 'file-video',
  FileWord : 'file-word',
  FileWordBox : 'file-word-box',
  FileXml : 'file-xml',
  Film : 'film',
  Filmstrip : 'filmstrip',
  FilmstripOff : 'filmstrip-off',
  Filter : 'filter',
  FilterOutline : 'filter-outline',
  FilterRemove : 'filter-remove',
  FilterRemoveOutline : 'filter-remove-outline',
  FilterVariant : 'filter-variant',
  Fingerprint : 'fingerprint',
  Fire : 'fire',
  Firefox : 'firefox',
  Fish : 'fish',
  Flag : 'flag',
  FlagCheckered : 'flag-checkered',
  FlagOutline : 'flag-outline',
  FlagOutlineVariant : 'flag-outline-variant',
  FlagTriangle : 'flag-triangle',
  FlagVariant : 'flag-variant',
  Flash : 'flash',
  FlashAuto : 'flash-auto',
  FlashOff : 'flash-off',
  FlashRedEye : 'flash-red-eye',
  Flashlight : 'flashlight',
  FlashlightOff : 'flashlight-off',
  Flask : 'flask',
  FlaskEmpty : 'flask-empty',
  FlaskEmptyOutline : 'flask-empty-outline',
  FlaskOutline : 'flask-outline',
  Flattr : 'flattr',
  FlipToBack : 'flip-to-back',
  FlipToFront : 'flip-to-front',
  Floppy : 'floppy',
  Flower : 'flower',
  Folder : 'folder',
  FolderAccount : 'folder-account',
  FolderDownload : 'folder-download',
  FolderGoogleDrive : 'folder-google-drive',
  FolderImage : 'folder-image',
  FolderLock : 'folder-lock',
  FolderLockOpen : 'folder-lock-open',
  FolderMove : 'folder-move',
  FolderMultiple : 'folder-multiple',
  FolderMultipleImage : 'folder-multiple-image',
  FolderMultipleOutline : 'folder-multiple-outline',
  FolderOutline : 'folder-outline',
  FolderPlus : 'folder-plus',
  FolderRemove : 'folder-remove',
  FolderStar : 'folder-star',
  FolderUpload : 'folder-upload',
  Food : 'food',
  FoodApple : 'food-apple',
  FoodForkDrink : 'food-fork-drink',
  FoodOff : 'food-off',
  FoodVariant : 'food-variant',
  Football : 'football',
  FootballAustralian : 'football-australian',
  FootballHelmet : 'football-helmet',
  FormatAlignCenter : 'format-align-center',
  FormatAlignJustify : 'format-align-justify',
  FormatAlignLeft : 'format-align-left',
  FormatAlignRight : 'format-align-right',
  FormatAnnotationPlus : 'format-annotation-plus',
  FormatBold : 'format-bold',
  FormatClear : 'format-clear',
  FormatColorFill : 'format-color-fill',
  FormatColorText : 'format-color-text',
  FormatFloatCenter : 'format-float-center',
  FormatFloatLeft : 'format-float-left',
  FormatFloatNone : 'format-float-none',
  FormatFloatRight : 'format-float-right',
  FormatHeader1 : 'format-header-1',
  FormatHeader2 : 'format-header-2',
  FormatHeader3 : 'format-header-3',
  FormatHeader4 : 'format-header-4',
  FormatHeader5 : 'format-header-5',
  FormatHeader6 : 'format-header-6',
  FormatHeaderDecrease : 'format-header-decrease',
  FormatHeaderEqual : 'format-header-equal',
  FormatHeaderIncrease : 'format-header-increase',
  FormatHeaderPound : 'format-header-pound',
  FormatHorizontalAlignCenter : 'format-horizontal-align-center',
  FormatHorizontalAlignLeft : 'format-horizontal-align-left',
  FormatHorizontalAlignRight : 'format-horizontal-align-right',
  FormatIndentDecrease : 'format-indent-decrease',
  FormatIndentIncrease : 'format-indent-increase',
  FormatItalic : 'format-italic',
  FormatLineSpacing : 'format-line-spacing',
  FormatLineStyle : 'format-line-style',
  FormatLineWeight : 'format-line-weight',
  FormatListBulleted : 'format-list-bulleted',
  FormatListBulletedType : 'format-list-bulleted-type',
  FormatListNumbers : 'format-list-numbers',
  FormatPaint : 'format-paint',
  FormatParagraph : 'format-paragraph',
  FormatQuote : 'format-quote',
  FormatSection : 'format-section',
  FormatSize : 'format-size',
  FormatStrikethrough : 'format-strikethrough',
  FormatStrikethroughVariant : 'format-strikethrough-variant',
  FormatSubscript : 'format-subscript',
  FormatSuperscript : 'format-superscript',
  FormatText : 'format-text',
  FormatTextdirectionLToR : 'format-textdirection-l-to-r',
  FormatTextdirectionRToL : 'format-textdirection-r-to-l',
  FormatTitle : 'format-title',
  FormatUnderline : 'format-underline',
  FormatVerticalAlignBottom : 'format-vertical-align-bottom',
  FormatVerticalAlignCenter : 'format-vertical-align-center',
  FormatVerticalAlignTop : 'format-vertical-align-top',
  FormatWrapInline : 'format-wrap-inline',
  FormatWrapSquare : 'format-wrap-square',
  FormatWrapTight : 'format-wrap-tight',
  FormatWrapTopBottom : 'format-wrap-top-bottom',
  Forum : 'forum',
  Forward : 'forward',
  Foursquare : 'foursquare',
  Fridge : 'fridge',
  FridgeFilled : 'fridge-filled',
  FridgeFilledBottom : 'fridge-filled-bottom',
  FridgeFilledTop : 'fridge-filled-top',
  Fullscreen : 'fullscreen',
  FullscreenExit : 'fullscreen-exit',
  Function : 'function',
  Gamepad : 'gamepad',
  GamepadVariant : 'gamepad-variant',
  GasCylinder : 'gas-cylinder',
  GasStation : 'gas-station',
  Gate : 'gate',
  Gauge : 'gauge',
  Gavel : 'gavel',
  GenderFemale : 'gender-female',
  GenderMale : 'gender-male',
  GenderMaleFemale : 'gender-male-female',
  GenderTransgender : 'gender-transgender',
  Ghost : 'ghost',
  Gift : 'gift',
  Git : 'git',
  GithubBox : 'github-box',
  GithubCircle : 'github-circle',
  GlassFlute : 'glass-flute',
  GlassMug : 'glass-mug',
  GlassStange : 'glass-stange',
  GlassTulip : 'glass-tulip',
  Glassdoor : 'glassdoor',
  Glasses : 'glasses',
  Gmail : 'gmail',
  Gnome : 'gnome',
  Gondola : 'gondola',
  Google : 'google',
  GoogleCardboard : 'google-cardboard',
  GoogleChrome : 'google-chrome',
  GoogleCircles : 'google-circles',
  GoogleCirclesCommunities : 'google-circles-communities',
  GoogleCirclesExtended : 'google-circles-extended',
  GoogleCirclesGroup : 'google-circles-group',
  GoogleController : 'google-controller',
  GoogleControllerOff : 'google-controller-off',
  GoogleDrive : 'google-drive',
  GoogleEarth : 'google-earth',
  GoogleGlass : 'google-glass',
  GoogleMaps : 'google-maps',
  GoogleNearby : 'google-nearby',
  GooglePages : 'google-pages',
  GooglePhysicalWeb : 'google-physical-web',
  GooglePlay : 'google-play',
  GooglePlus : 'google-plus',
  GooglePlusBox : 'google-plus-box',
  GoogleTranslate : 'google-translate',
  GoogleWallet : 'google-wallet',
  Gradient : 'gradient',
  GreasePencil : 'grease-pencil',
  Grid : 'grid',
  GridOff : 'grid-off',
  Group : 'group',
  GuitarElectric : 'guitar-electric',
  GuitarPick : 'guitar-pick',
  GuitarPickOutline : 'guitar-pick-outline',
  Hackernews : 'hackernews',
  Hamburger : 'hamburger',
  HandPointingRight : 'hand-pointing-right',
  Hanger : 'hanger',
  Hangouts : 'hangouts',
  Harddisk : 'harddisk',
  Headphones : 'headphones',
  HeadphonesBox : 'headphones-box',
  HeadphonesSettings : 'headphones-settings',
  Headset : 'headset',
  HeadsetDock : 'headset-dock',
  HeadsetOff : 'headset-off',
  Heart : 'heart',
  HeartBox : 'heart-box',
  HeartBoxOutline : 'heart-box-outline',
  HeartBroken : 'heart-broken',
  HeartOutline : 'heart-outline',
  HeartPulse : 'heart-pulse',
  Help : 'help',
  HelpCircle : 'help-circle',
  HelpCircleOutline : 'help-circle-outline',
  Hexagon : 'hexagon',
  HexagonOutline : 'hexagon-outline',
  Highway : 'highway',
  History : 'history',
  Hololens : 'hololens',
  Home : 'home',
  HomeMapMarker : 'home-map-marker',
  HomeModern : 'home-modern',
  HomeOutline : 'home-outline',
  HomeVariant : 'home-variant',
  Hops : 'hops',
  Hospital : 'hospital',
  HospitalBuilding : 'hospital-building',
  HospitalMarker : 'hospital-marker',
  Hotel : 'hotel',
  Houzz : 'houzz',
  HouzzBox : 'houzz-box',
  Human : 'human',
  HumanChild : 'human-child',
  HumanFemale : 'human-female',
  HumanGreeting : 'human-greeting',
  HumanHandsdown : 'human-handsdown',
  HumanHandsup : 'human-handsup',
  HumanMale : 'human-male',
  HumanMaleFemale : 'human-male-female',
  HumanPregnant : 'human-pregnant',
  Image : 'image',
  ImageAlbum : 'image-album',
  ImageArea : 'image-area',
  ImageAreaClose : 'image-area-close',
  ImageBroken : 'image-broken',
  ImageBrokenVariant : 'image-broken-variant',
  ImageFilter : 'image-filter',
  ImageFilterBlackWhite : 'image-filter-black-white',
  ImageFilterCenterFocus : 'image-filter-center-focus',
  ImageFilterCenterFocusWeak : 'image-filter-center-focus-weak',
  ImageFilterDrama : 'image-filter-drama',
  ImageFilterFrames : 'image-filter-frames',
  ImageFilterHdr : 'image-filter-hdr',
  ImageFilterNone : 'image-filter-none',
  ImageFilterTiltShift : 'image-filter-tilt-shift',
  ImageFilterVintage : 'image-filter-vintage',
  ImageMultiple : 'image-multiple',
  Import : 'import',
  Inbox : 'inbox',
  InboxArrowDown : 'inbox-arrow-down',
  InboxArrowUp : 'inbox-arrow-up',
  Incognito : 'incognito',
  Information : 'information',
  InformationOutline : 'information-outline',
  InformationVariant : 'information-variant',
  Instagram : 'instagram',
  Instapaper : 'instapaper',
  InternetExplorer : 'internet-explorer',
  InvertColors : 'invert-colors',
  Itunes : 'itunes',
  Jeepney : 'jeepney',
  Jira : 'jira',
  Jsfiddle : 'jsfiddle',
  Json : 'json',
  Keg : 'keg',
  Kettle : 'kettle',
  Key : 'key',
  KeyChange : 'key-change',
  KeyMinus : 'key-minus',
  KeyPlus : 'key-plus',
  KeyRemove : 'key-remove',
  KeyVariant : 'key-variant',
  Keyboard : 'keyboard',
  KeyboardBackspace : 'keyboard-backspace',
  KeyboardCaps : 'keyboard-caps',
  KeyboardClose : 'keyboard-close',
  KeyboardOff : 'keyboard-off',
  KeyboardReturn : 'keyboard-return',
  KeyboardTab : 'keyboard-tab',
  KeyboardVariant : 'keyboard-variant',
  Kodi : 'kodi',
  Label : 'label',
  LabelOutline : 'label-outline',
  Lambda : 'lambda',
  Lamp : 'lamp',
  Lan : 'lan',
  LanConnect : 'lan-connect',
  LanDisconnect : 'lan-disconnect',
  LanPending : 'lan-pending',
  LanguageC : 'language-c',
  LanguageCpp : 'language-cpp',
  LanguageCsharp : 'language-csharp',
  LanguageCss3 : 'language-css3',
  LanguageHtml5 : 'language-html5',
  LanguageJavascript : 'language-javascript',
  LanguagePhp : 'language-php',
  LanguagePython : 'language-python',
  LanguagePythonText : 'language-python-text',
  Laptop : 'laptop',
  LaptopChromebook : 'laptop-chromebook',
  LaptopMac : 'laptop-mac',
  LaptopWindows : 'laptop-windows',
  Lastfm : 'lastfm',
  Launch : 'launch',
  Layers : 'layers',
  LayersOff : 'layers-off',
  LeadPencil : 'lead-pencil',
  Leaf : 'leaf',
  LedOff : 'led-off',
  LedOn : 'led-on',
  LedOutline : 'led-outline',
  LedVariantOff : 'led-variant-off',
  LedVariantOn : 'led-variant-on',
  LedVariantOutline : 'led-variant-outline',
  Library : 'library',
  LibraryBooks : 'library-books',
  LibraryMusic : 'library-music',
  LibraryPlus : 'library-plus',
  Lightbulb : 'lightbulb',
  LightbulbOutline : 'lightbulb-outline',
  Link : 'link',
  LinkOff : 'link-off',
  LinkVariant : 'link-variant',
  LinkVariantOff : 'link-variant-off',
  Linkedin : 'linkedin',
  LinkedinBox : 'linkedin-box',
  Linux : 'linux',
  Lock : 'lock',
  LockOpen : 'lock-open',
  LockOpenOutline : 'lock-open-outline',
  LockOutline : 'lock-outline',
  LockPlus : 'lock-plus',
  Login : 'login',
  LoginVariant : 'login-variant',
  Logout : 'logout',
  LogoutVariant : 'logout-variant',
  Looks : 'looks',
  Loupe : 'loupe',
  Lumx : 'lumx',
  Magnet : 'magnet',
  MagnetOn : 'magnet-on',
  Magnify : 'magnify',
  MagnifyMinus : 'magnify-minus',
  MagnifyPlus : 'magnify-plus',
  MailRu : 'mail-ru',
  Map : 'map',
  MapMarker : 'map-marker',
  MapMarkerCircle : 'map-marker-circle',
  MapMarkerMinus : 'map-marker-minus',
  MapMarkerMultiple : 'map-marker-multiple',
  MapMarkerOff : 'map-marker-off',
  MapMarkerPlus : 'map-marker-plus',
  MapMarkerRadius : 'map-marker-radius',
  Margin : 'margin',
  Markdown : 'markdown',
  Marker : 'marker',
  MarkerCheck : 'marker-check',
  Martini : 'martini',
  MaterialUi : 'material-ui',
  MathCompass : 'math-compass',
  Matrix : 'matrix',
  Maxcdn : 'maxcdn',
  Medium : 'medium',
  Memory : 'memory',
  Menu : 'menu',
  MenuDown : 'menu-down',
  MenuDownOutline : 'menu-down-outline',
  MenuLeft : 'menu-left',
  MenuRight : 'menu-right',
  MenuUp : 'menu-up',
  MenuUpOutline : 'menu-up-outline',
  Message : 'message',
  MessageAlert : 'message-alert',
  MessageBulleted : 'message-bulleted',
  MessageBulletedOff : 'message-bulleted-off',
  MessageDraw : 'message-draw',
  MessageImage : 'message-image',
  MessageOutline : 'message-outline',
  MessagePlus : 'message-plus',
  MessageProcessing : 'message-processing',
  MessageReply : 'message-reply',
  MessageReplyText : 'message-reply-text',
  MessageText : 'message-text',
  MessageTextOutline : 'message-text-outline',
  MessageVideo : 'message-video',
  Meteor : 'meteor',
  Microphone : 'microphone',
  MicrophoneOff : 'microphone-off',
  MicrophoneOutline : 'microphone-outline',
  MicrophoneSettings : 'microphone-settings',
  MicrophoneVariant : 'microphone-variant',
  MicrophoneVariantOff : 'microphone-variant-off',
  Microscope : 'microscope',
  Microsoft : 'microsoft',
  Minecraft : 'minecraft',
  Minus : 'minus',
  MinusBox : 'minus-box',
  MinusCircle : 'minus-circle',
  MinusCircleOutline : 'minus-circle-outline',
  MinusNetwork : 'minus-network',
  Mixcloud : 'mixcloud',
  Monitor : 'monitor',
  MonitorMultiple : 'monitor-multiple',
  More : 'more',
  Motorbike : 'motorbike',
  Mouse : 'mouse',
  MouseOff : 'mouse-off',
  MouseVariant : 'mouse-variant',
  MouseVariantOff : 'mouse-variant-off',
  MoveResize : 'move-resize',
  MoveResizeVariant : 'move-resize-variant',
  Movie : 'movie',
  Multiplication : 'multiplication',
  MultiplicationBox : 'multiplication-box',
  MusicBox : 'music-box',
  MusicBoxOutline : 'music-box-outline',
  MusicCircle : 'music-circle',
  MusicNote : 'music-note',
  MusicNoteBluetooth : 'music-note-bluetooth',
  MusicNoteBluetoothOff : 'music-note-bluetooth-off',
  MusicNoteEighth : 'music-note-eighth',
  MusicNoteHalf : 'music-note-half',
  MusicNoteOff : 'music-note-off',
  MusicNoteQuarter : 'music-note-quarter',
  MusicNoteSixteenth : 'music-note-sixteenth',
  MusicNoteWhole : 'music-note-whole',
  Nature : 'nature',
  NaturePeople : 'nature-people',
  Navigation : 'navigation',
  NearMe : 'near-me',
  Needle : 'needle',
  NestProtect : 'nest-protect',
  NestThermostat : 'nest-thermostat',
  NewBox : 'new-box',
  Newspaper : 'newspaper',
  Nfc : 'nfc',
  NfcTap : 'nfc-tap',
  NfcVariant : 'nfc-variant',
  Nodejs : 'nodejs',
  Note : 'note',
  NoteMultiple : 'note-multiple',
  NoteMultipleOutline : 'note-multiple-outline',
  NoteOutline : 'note-outline',
  NotePlus : 'note-plus',
  NotePlusOutline : 'note-plus-outline',
  NoteText : 'note-text',
  NotificationClearAll : 'notification-clear-all',
  Nuke : 'nuke',
  Numeric : 'numeric',
  Numeric0Box : 'numeric-0-box',
  Numeric0BoxMultipleOutline : 'numeric-0-box-multiple-outline',
  Numeric0BoxOutline : 'numeric-0-box-outline',
  Numeric1Box : 'numeric-1-box',
  Numeric1BoxMultipleOutline : 'numeric-1-box-multiple-outline',
  Numeric1BoxOutline : 'numeric-1-box-outline',
  Numeric2Box : 'numeric-2-box',
  Numeric2BoxMultipleOutline : 'numeric-2-box-multiple-outline',
  Numeric2BoxOutline : 'numeric-2-box-outline',
  Numeric3Box : 'numeric-3-box',
  Numeric3BoxMultipleOutline : 'numeric-3-box-multiple-outline',
  Numeric3BoxOutline : 'numeric-3-box-outline',
  Numeric4Box : 'numeric-4-box',
  Numeric4BoxMultipleOutline : 'numeric-4-box-multiple-outline',
  Numeric4BoxOutline : 'numeric-4-box-outline',
  Numeric5Box : 'numeric-5-box',
  Numeric5BoxMultipleOutline : 'numeric-5-box-multiple-outline',
  Numeric5BoxOutline : 'numeric-5-box-outline',
  Numeric6Box : 'numeric-6-box',
  Numeric6BoxMultipleOutline : 'numeric-6-box-multiple-outline',
  Numeric6BoxOutline : 'numeric-6-box-outline',
  Numeric7Box : 'numeric-7-box',
  Numeric7BoxMultipleOutline : 'numeric-7-box-multiple-outline',
  Numeric7BoxOutline : 'numeric-7-box-outline',
  Numeric8Box : 'numeric-8-box',
  Numeric8BoxMultipleOutline : 'numeric-8-box-multiple-outline',
  Numeric8BoxOutline : 'numeric-8-box-outline',
  Numeric9Box : 'numeric-9-box',
  Numeric9BoxMultipleOutline : 'numeric-9-box-multiple-outline',
  Numeric9BoxOutline : 'numeric-9-box-outline',
  Numeric9PlusBox : 'numeric-9-plus-box',
  Numeric9PlusBoxMultipleOutline : 'numeric-9-plus-box-multiple-outline',
  Numeric9PlusBoxOutline : 'numeric-9-plus-box-outline',
  Nutrition : 'nutrition',
  Oar : 'oar',
  Octagon : 'octagon',
  OctagonOutline : 'octagon-outline',
  Odnoklassniki : 'odnoklassniki',
  Office : 'office',
  Oil : 'oil',
  OilTemperature : 'oil-temperature',
  Omega : 'omega',
  Onedrive : 'onedrive',
  Opacity : 'opacity',
  OpenInApp : 'open-in-app',
  OpenInNew : 'open-in-new',
  Openid : 'openid',
  Opera : 'opera',
  Ornament : 'ornament',
  OrnamentVariant : 'ornament-variant',
  Owl : 'owl',
  Package : 'package',
  PackageDown : 'package-down',
  PackageUp : 'package-up',
  PackageVariant : 'package-variant',
  PackageVariantClosed : 'package-variant-closed',
  PageFirst : 'page-first',
  PageLast : 'page-last',
  Palette : 'palette',
  PaletteAdvanced : 'palette-advanced',
  Panda : 'panda',
  Pandora : 'pandora',
  Panorama : 'panorama',
  PanoramaFisheye : 'panorama-fisheye',
  PanoramaHorizontal : 'panorama-horizontal',
  PanoramaVertical : 'panorama-vertical',
  PanoramaWideAngle : 'panorama-wide-angle',
  PaperCutVertical : 'paper-cut-vertical',
  Paperclip : 'paperclip',
  Parking : 'parking',
  Pause : 'pause',
  PauseCircle : 'pause-circle',
  PauseCircleOutline : 'pause-circle-outline',
  PauseOctagon : 'pause-octagon',
  PauseOctagonOutline : 'pause-octagon-outline',
  Paw : 'paw',
  PawOff : 'paw-off',
  Pen : 'pen',
  Pencil : 'pencil',
  PencilBox : 'pencil-box',
  PencilBoxOutline : 'pencil-box-outline',
  PencilLock : 'pencil-lock',
  PencilOff : 'pencil-off',
  Percent : 'percent',
  Pharmacy : 'pharmacy',
  Phone : 'phone',
  PhoneBluetooth : 'phone-bluetooth',
  PhoneClassic : 'phone-classic',
  PhoneForward : 'phone-forward',
  PhoneHangup : 'phone-hangup',
  PhoneInTalk : 'phone-in-talk',
  PhoneIncoming : 'phone-incoming',
  PhoneLocked : 'phone-locked',
  PhoneLog : 'phone-log',
  PhoneMinus : 'phone-minus',
  PhoneMissed : 'phone-missed',
  PhoneOutgoing : 'phone-outgoing',
  PhonePaused : 'phone-paused',
  PhonePlus : 'phone-plus',
  PhoneSettings : 'phone-settings',
  PhoneVoip : 'phone-voip',
  Pi : 'pi',
  PiBox : 'pi-box',
  Piano : 'piano',
  Pig : 'pig',
  Pill : 'pill',
  Pin : 'pin',
  PinOff : 'pin-off',
  PineTree : 'pine-tree',
  PineTreeBox : 'pine-tree-box',
  Pinterest : 'pinterest',
  PinterestBox : 'pinterest-box',
  Pizza : 'pizza',
  PlaneShield : 'plane-shield',
  Play : 'play',
  PlayBoxOutline : 'play-box-outline',
  PlayCircle : 'play-circle',
  PlayCircleOutline : 'play-circle-outline',
  PlayPause : 'play-pause',
  PlayProtectedContent : 'play-protected-content',
  PlaylistCheck : 'playlist-check',
  PlaylistMinus : 'playlist-minus',
  PlaylistPlay : 'playlist-play',
  PlaylistPlus : 'playlist-plus',
  PlaylistRemove : 'playlist-remove',
  Playstation : 'playstation',
  Plex : 'plex',
  Plus : 'plus',
  PlusBox : 'plus-box',
  PlusCircle : 'plus-circle',
  PlusCircleMultipleOutline : 'plus-circle-multiple-outline',
  PlusCircleOutline : 'plus-circle-outline',
  PlusNetwork : 'plus-network',
  PlusOne : 'plus-one',
  Pocket : 'pocket',
  Pokeball : 'pokeball',
  Polaroid : 'polaroid',
  Poll : 'poll',
  PollBox : 'poll-box',
  Polymer : 'polymer',
  Pool : 'pool',
  Popcorn : 'popcorn',
  Pot : 'pot',
  PotMix : 'pot-mix',
  Pound : 'pound',
  PoundBox : 'pound-box',
  Power : 'power',
  PowerPlug : 'power-plug',
  PowerPlugOff : 'power-plug-off',
  PowerSettings : 'power-settings',
  PowerSocket : 'power-socket',
  Presentation : 'presentation',
  PresentationPlay : 'presentation-play',
  Printer : 'printer',
  Printer3d : 'printer-3d',
  PrinterAlert : 'printer-alert',
  PriorityHigh : 'priority-high',
  PriorityLow : 'priority-low',
  ProfessionalHexagon : 'professional-hexagon',
  Projector : 'projector',
  ProjectorScreen : 'projector-screen',
  Publish : 'publish',
  Pulse : 'pulse',
  Puzzle : 'puzzle',
  Qqchat : 'qqchat',
  Qrcode : 'qrcode',
  QrcodeScan : 'qrcode-scan',
  Quadcopter : 'quadcopter',
  QualityHigh : 'quality-high',
  Quicktime : 'quicktime',
  Radar : 'radar',
  Radiator : 'radiator',
  Radio : 'radio',
  RadioHandheld : 'radio-handheld',
  RadioTower : 'radio-tower',
  Radioactive : 'radioactive',
  RadioboxBlank : 'radiobox-blank',
  RadioboxMarked : 'radiobox-marked',
  Raspberrypi : 'raspberrypi',
  RayEnd : 'ray-end',
  RayEndArrow : 'ray-end-arrow',
  RayStart : 'ray-start',
  RayStartArrow : 'ray-start-arrow',
  RayStartEnd : 'ray-start-end',
  RayVertex : 'ray-vertex',
  Rdio : 'rdio',
  Read : 'read',
  Readability : 'readability',
  Receipt : 'receipt',
  Record : 'record',
  RecordRec : 'record-rec',
  Recycle : 'recycle',
  Reddit : 'reddit',
  Redo : 'redo',
  RedoVariant : 'redo-variant',
  Refresh : 'refresh',
  Regex : 'regex',
  RelativeScale : 'relative-scale',
  Reload : 'reload',
  Remote : 'remote',
  RenameBox : 'rename-box',
  ReorderHorizontal : 'reorder-horizontal',
  ReorderVertical : 'reorder-vertical',
  Repeat : 'repeat',
  RepeatOff : 'repeat-off',
  RepeatOnce : 'repeat-once',
  Replay : 'replay',
  Reply : 'reply',
  ReplyAll : 'reply-all',
  Reproduction : 'reproduction',
  ResizeBottomRight : 'resize-bottom-right',
  Responsive : 'responsive',
  Restore : 'restore',
  Rewind : 'rewind',
  Ribbon : 'ribbon',
  Road : 'road',
  RoadVariant : 'road-variant',
  Robot : 'robot',
  Rocket : 'rocket',
  Rotate3d : 'rotate-3d',
  Rotate90 : 'rotate-90',
  RotateLeft : 'rotate-left',
  RotateLeftVariant : 'rotate-left-variant',
  RotateRight : 'rotate-right',
  RotateRightVariant : 'rotate-right-variant',
  RoundedCorner : 'rounded-corner',
  RouterWireless : 'router-wireless',
  Routes : 'routes',
  Rowing : 'rowing',
  Rss : 'rss',
  RssBox : 'rss-box',
  Ruler : 'ruler',
  Run : 'run',
  Sale : 'sale',
  Satellite : 'satellite',
  SatelliteVariant : 'satellite-variant',
  Saxophone : 'saxophone',
  Scale : 'scale',
  ScaleBalance : 'scale-balance',
  ScaleBathroom : 'scale-bathroom',
  Scanner : 'scanner',
  School : 'school',
  ScreenRotation : 'screen-rotation',
  ScreenRotationLock : 'screen-rotation-lock',
  Screwdriver : 'screwdriver',
  Script : 'script',
  Sd : 'sd',
  Seal : 'seal',
  SeatFlat : 'seat-flat',
  SeatFlatAngled : 'seat-flat-angled',
  SeatIndividualSuite : 'seat-individual-suite',
  SeatLegroomExtra : 'seat-legroom-extra',
  SeatLegroomNormal : 'seat-legroom-normal',
  SeatLegroomReduced : 'seat-legroom-reduced',
  SeatReclineExtra : 'seat-recline-extra',
  SeatReclineNormal : 'seat-recline-normal',
  Security : 'security',
  SecurityHome : 'security-home',
  SecurityNetwork : 'security-network',
  Select : 'select',
  SelectAll : 'select-all',
  SelectInverse : 'select-inverse',
  SelectOff : 'select-off',
  Selection : 'selection',
  Send : 'send',
  SerialPort : 'serial-port',
  Server : 'server',
  ServerMinus : 'server-minus',
  ServerNetwork : 'server-network',
  ServerNetworkOff : 'server-network-off',
  ServerOff : 'server-off',
  ServerPlus : 'server-plus',
  ServerRemove : 'server-remove',
  ServerSecurity : 'server-security',
  Settings : 'settings',
  SettingsBox : 'settings-box',
  ShapeCirclePlus : 'shape-circle-plus',
  ShapePlus : 'shape-plus',
  ShapePolygonPlus : 'shape-polygon-plus',
  ShapeRectanglePlus : 'shape-rectangle-plus',
  ShapeSquarePlus : 'shape-square-plus',
  Share : 'share',
  ShareVariant : 'share-variant',
  Shield : 'shield',
  ShieldOutline : 'shield-outline',
  Shopping : 'shopping',
  ShoppingMusic : 'shopping-music',
  Shredder : 'shredder',
  Shuffle : 'shuffle',
  ShuffleDisabled : 'shuffle-disabled',
  ShuffleVariant : 'shuffle-variant',
  Sigma : 'sigma',
  SigmaLower : 'sigma-lower',
  SignCaution : 'sign-caution',
  Signal : 'signal',
  SignalVariant : 'signal-variant',
  Silverware : 'silverware',
  SilverwareFork : 'silverware-fork',
  SilverwareSpoon : 'silverware-spoon',
  SilverwareVariant : 'silverware-variant',
  Sim : 'sim',
  SimAlert : 'sim-alert',
  SimOff : 'sim-off',
  Sitemap : 'sitemap',
  SkipBackward : 'skip-backward',
  SkipForward : 'skip-forward',
  SkipNext : 'skip-next',
  SkipNextCircle : 'skip-next-circle',
  SkipNextCircleOutline : 'skip-next-circle-outline',
  SkipPrevious : 'skip-previous',
  SkipPreviousCircle : 'skip-previous-circle',
  SkipPreviousCircleOutline : 'skip-previous-circle-outline',
  Skull : 'skull',
  Skype : 'skype',
  SkypeBusiness : 'skype-business',
  Slack : 'slack',
  Sleep : 'sleep',
  SleepOff : 'sleep-off',
  Smoking : 'smoking',
  SmokingOff : 'smoking-off',
  Snapchat : 'snapchat',
  Snowman : 'snowman',
  Soccer : 'soccer',
  Sofa : 'sofa',
  Solid : 'solid',
  Sort : 'sort',
  SortAlphabetical : 'sort-alphabetical',
  SortAscending : 'sort-ascending',
  SortDescending : 'sort-descending',
  SortNumeric : 'sort-numeric',
  SortVariant : 'sort-variant',
  Soundcloud : 'soundcloud',
  SourceBranch : 'source-branch',
  SourceFork : 'source-fork',
  SourceMerge : 'source-merge',
  SourcePull : 'source-pull',
  Speaker : 'speaker',
  SpeakerOff : 'speaker-off',
  Speedometer : 'speedometer',
  Spellcheck : 'spellcheck',
  Spotify : 'spotify',
  Spotlight : 'spotlight',
  SpotlightBeam : 'spotlight-beam',
  Spray : 'spray',
  SquareInc : 'square-inc',
  SquareIncCash : 'square-inc-cash',
  Stackexchange : 'stackexchange',
  Stackoverflow : 'stackoverflow',
  Stairs : 'stairs',
  Star : 'star',
  StarCircle : 'star-circle',
  StarHalf : 'star-half',
  StarOff : 'star-off',
  StarOutline : 'star-outline',
  Steam : 'steam',
  Steering : 'steering',
  StepBackward : 'step-backward',
  StepBackward2 : 'step-backward-2',
  StepForward : 'step-forward',
  StepForward2 : 'step-forward-2',
  Stethoscope : 'stethoscope',
  Sticker : 'sticker',
  Stocking : 'stocking',
  Stop : 'stop',
  StopCircle : 'stop-circle',
  StopCircleOutline : 'stop-circle-outline',
  Store : 'store',
  Store24Hour : 'store-24-hour',
  Stove : 'stove',
  SubdirectoryArrowLeft : 'subdirectory-arrow-left',
  SubdirectoryArrowRight : 'subdirectory-arrow-right',
  Subway : 'subway',
  SubwayVariant : 'subway-variant',
  Sunglasses : 'sunglasses',
  SurroundSound : 'surround-sound',
  SwapHorizontal : 'swap-horizontal',
  SwapVertical : 'swap-vertical',
  Swim : 'swim',
  Switch : 'switch',
  Sword : 'sword',
  Sync : 'sync',
  SyncAlert : 'sync-alert',
  SyncOff : 'sync-off',
  Tab : 'tab',
  TabUnselected : 'tab-unselected',
  Table : 'table',
  TableColumnPlusAfter : 'table-column-plus-after',
  TableColumnPlusBefore : 'table-column-plus-before',
  TableColumnRemove : 'table-column-remove',
  TableColumnWidth : 'table-column-width',
  TableEdit : 'table-edit',
  TableLarge : 'table-large',
  TableRowHeight : 'table-row-height',
  TableRowPlusAfter : 'table-row-plus-after',
  TableRowPlusBefore : 'table-row-plus-before',
  TableRowRemove : 'table-row-remove',
  Tablet : 'tablet',
  TabletAndroid : 'tablet-android',
  TabletIpad : 'tablet-ipad',
  Tag : 'tag',
  TagFaces : 'tag-faces',
  TagHeart : 'tag-heart',
  TagMultiple : 'tag-multiple',
  TagOutline : 'tag-outline',
  TagTextOutline : 'tag-text-outline',
  Target : 'target',
  Taxi : 'taxi',
  Teamviewer : 'teamviewer',
  Telegram : 'telegram',
  Television : 'television',
  TelevisionGuide : 'television-guide',
  TemperatureCelsius : 'temperature-celsius',
  TemperatureFahrenheit : 'temperature-fahrenheit',
  TemperatureKelvin : 'temperature-kelvin',
  Tennis : 'tennis',
  Tent : 'tent',
  Terrain : 'terrain',
  TestTube : 'test-tube',
  TextShadow : 'text-shadow',
  TextToSpeech : 'text-to-speech',
  TextToSpeechOff : 'text-to-speech-off',
  Textbox : 'textbox',
  Texture : 'texture',
  Theater : 'theater',
  ThemeLightDark : 'theme-light-dark',
  Thermometer : 'thermometer',
  ThermometerLines : 'thermometer-lines',
  ThumbDown : 'thumb-down',
  ThumbDownOutline : 'thumb-down-outline',
  ThumbUp : 'thumb-up',
  ThumbUpOutline : 'thumb-up-outline',
  ThumbsUpDown : 'thumbs-up-down',
  Ticket : 'ticket',
  TicketAccount : 'ticket-account',
  TicketConfirmation : 'ticket-confirmation',
  Tie : 'tie',
  Timelapse : 'timelapse',
  Timer : 'timer',
  Timer10 : 'timer-10',
  Timer3 : 'timer-3',
  TimerOff : 'timer-off',
  TimerSand : 'timer-sand',
  TimerSandEmpty : 'timer-sand-empty',
  Timetable : 'timetable',
  ToggleSwitch : 'toggle-switch',
  ToggleSwitchOff : 'toggle-switch-off',
  Tooltip : 'tooltip',
  TooltipEdit : 'tooltip-edit',
  TooltipImage : 'tooltip-image',
  TooltipOutline : 'tooltip-outline',
  TooltipOutlinePlus : 'tooltip-outline-plus',
  TooltipText : 'tooltip-text',
  Tooth : 'tooth',
  Tor : 'tor',
  TowerBeach : 'tower-beach',
  TowerFire : 'tower-fire',
  TrafficLight : 'traffic-light',
  Train : 'train',
  Tram : 'tram',
  Transcribe : 'transcribe',
  TranscribeClose : 'transcribe-close',
  Transfer : 'transfer',
  TransitTransfer : 'transit-transfer',
  Translate : 'translate',
  Tree : 'tree',
  Trello : 'trello',
  TrendingDown : 'trending-down',
  TrendingNeutral : 'trending-neutral',
  TrendingUp : 'trending-up',
  Triangle : 'triangle',
  TriangleOutline : 'triangle-outline',
  Trophy : 'trophy',
  TrophyAward : 'trophy-award',
  TrophyOutline : 'trophy-outline',
  TrophyVariant : 'trophy-variant',
  TrophyVariantOutline : 'trophy-variant-outline',
  Truck : 'truck',
  TruckDelivery : 'truck-delivery',
  TshirtCrew : 'tshirt-crew',
  TshirtV : 'tshirt-v',
  Tumblr : 'tumblr',
  TumblrReblog : 'tumblr-reblog',
  Tune : 'tune',
  TuneVertical : 'tune-vertical',
  Twitch : 'twitch',
  Twitter : 'twitter',
  TwitterBox : 'twitter-box',
  TwitterCircle : 'twitter-circle',
  TwitterRetweet : 'twitter-retweet',
  Ubuntu : 'ubuntu',
  Umbraco : 'umbraco',
  Umbrella : 'umbrella',
  UmbrellaOutline : 'umbrella-outline',
  Undo : 'undo',
  UndoVariant : 'undo-variant',
  UnfoldLess : 'unfold-less',
  UnfoldMore : 'unfold-more',
  Ungroup : 'ungroup',
  Unity : 'unity',
  Untappd : 'untappd',
  Update : 'update',
  Upload : 'upload',
  Usb : 'usb',
  VectorArrangeAbove : 'vector-arrange-above',
  VectorArrangeBelow : 'vector-arrange-below',
  VectorCircle : 'vector-circle',
  VectorCircleVariant : 'vector-circle-variant',
  VectorCombine : 'vector-combine',
  VectorCurve : 'vector-curve',
  VectorDifference : 'vector-difference',
  VectorDifferenceAb : 'vector-difference-ab',
  VectorDifferenceBa : 'vector-difference-ba',
  VectorIntersection : 'vector-intersection',
  VectorLine : 'vector-line',
  VectorPoint : 'vector-point',
  VectorPolygon : 'vector-polygon',
  VectorPolyline : 'vector-polyline',
  VectorRectangle : 'vector-rectangle',
  VectorSelection : 'vector-selection',
  VectorSquare : 'vector-square',
  VectorTriangle : 'vector-triangle',
  VectorUnion : 'vector-union',
  Verified : 'verified',
  Vibrate : 'vibrate',
  Video : 'video',
  VideoOff : 'video-off',
  VideoSwitch : 'video-switch',
  ViewAgenda : 'view-agenda',
  ViewArray : 'view-array',
  ViewCarousel : 'view-carousel',
  ViewColumn : 'view-column',
  ViewDashboard : 'view-dashboard',
  ViewDay : 'view-day',
  ViewGrid : 'view-grid',
  ViewHeadline : 'view-headline',
  ViewList : 'view-list',
  ViewModule : 'view-module',
  ViewQuilt : 'view-quilt',
  ViewStream : 'view-stream',
  ViewWeek : 'view-week',
  Vimeo : 'vimeo',
  Vine : 'vine',
  Violin : 'violin',
  Visualstudio : 'visualstudio',
  Vk : 'vk',
  VkBox : 'vk-box',
  VkCircle : 'vk-circle',
  Vlc : 'vlc',
  Voice : 'voice',
  Voicemail : 'voicemail',
  VolumeHigh : 'volume-high',
  VolumeLow : 'volume-low',
  VolumeMedium : 'volume-medium',
  VolumeOff : 'volume-off',
  Vpn : 'vpn',
  Walk : 'walk',
  Wallet : 'wallet',
  WalletGiftcard : 'wallet-giftcard',
  WalletMembership : 'wallet-membership',
  WalletTravel : 'wallet-travel',
  Wan : 'wan',
  Watch : 'watch',
  WatchExport : 'watch-export',
  WatchImport : 'watch-import',
  WatchVibrate : 'watch-vibrate',
  Water : 'water',
  WaterOff : 'water-off',
  WaterPercent : 'water-percent',
  WaterPump : 'water-pump',
  Watermark : 'watermark',
  WeatherCloudy : 'weather-cloudy',
  WeatherFog : 'weather-fog',
  WeatherHail : 'weather-hail',
  WeatherLightning : 'weather-lightning',
  WeatherLightningRainy : 'weather-lightning-rainy',
  WeatherNight : 'weather-night',
  WeatherPartlycloudy : 'weather-partlycloudy',
  WeatherPouring : 'weather-pouring',
  WeatherRainy : 'weather-rainy',
  WeatherSnowy : 'weather-snowy',
  WeatherSnowyRainy : 'weather-snowy-rainy',
  WeatherSunny : 'weather-sunny',
  WeatherSunset : 'weather-sunset',
  WeatherSunsetDown : 'weather-sunset-down',
  WeatherSunsetUp : 'weather-sunset-up',
  WeatherWindy : 'weather-windy',
  WeatherWindyVariant : 'weather-windy-variant',
  Web : 'web',
  Webcam : 'webcam',
  Webhook : 'webhook',
  Wechat : 'wechat',
  Weight : 'weight',
  WeightKilogram : 'weight-kilogram',
  Whatsapp : 'whatsapp',
  WheelchairAccessibility : 'wheelchair-accessibility',
  WhiteBalanceAuto : 'white-balance-auto',
  WhiteBalanceIncandescent : 'white-balance-incandescent',
  WhiteBalanceIridescent : 'white-balance-iridescent',
  WhiteBalanceSunny : 'white-balance-sunny',
  Wifi : 'wifi',
  WifiOff : 'wifi-off',
  Wii : 'wii',
  Wikipedia : 'wikipedia',
  WindowClose : 'window-close',
  WindowClosed : 'window-closed',
  WindowMaximize : 'window-maximize',
  WindowMinimize : 'window-minimize',
  WindowOpen : 'window-open',
  WindowRestore : 'window-restore',
  Windows : 'windows',
  Wordpress : 'wordpress',
  Worker : 'worker',
  Wrap : 'wrap',
  Wrench : 'wrench',
  Wunderlist : 'wunderlist',
  Xaml : 'xaml',
  Xbox : 'xbox',
  XboxController : 'xbox-controller',
  XboxControllerOff : 'xbox-controller-off',
  Xda : 'xda',
  Xing : 'xing',
  XingBox : 'xing-box',
  XingCircle : 'xing-circle',
  Xml : 'xml',
  Yeast : 'yeast',
  Yelp : 'yelp',
  YinYang : 'yin-yang',
  YoutubePlay : 'youtube-play',
  ZipBox : 'zip-box',

  AmericanSignLanguageInterpreting : 'american-sign-language-interpreting',
  AslInterpreting : 'asl-interpreting',
  AssistiveListeningSystems : 'assistive-listening-systems',
  AudioDescription : 'audio-description',
  Blind : 'blind',
  Braille : 'braille',
  Deaf : 'deaf',
  Deafness : 'deafness',
  Envira : 'envira',
  Fa : 'fa',
  FirstOrder : 'first-order',
  FontAwesome : 'font-awesome',
  Gitlab : 'gitlab',
  Glide : 'glide',
  GlideG : 'glide-g',
  GooglePlusCircle : 'google-plus-circle',
  GooglePlusOfficial : 'google-plus-official',
  HardOfHearing : 'hard-of-hearing',
  LowVision : 'low-vision',
  QuestionCircleO : 'question-circle-o',
  SignLanguage : 'sign-language',
  Signing : 'signing',
  Snapchat : 'snapchat',
  SnapchatGhost : 'snapchat-ghost',
  SnapchatSquare : 'snapchat-square',
  Themeisle : 'themeisle',
  UniversalAccess : 'universal-access',
  Viadeo : 'viadeo',
  ViadeoSquare : 'viadeo-square',
  VolumeControlPhone : 'volume-control-phone',
  WheelchairAlt : 'wheelchair-alt',
  Wpbeginner : 'wpbeginner',
  Wpforms : 'wpforms',
  Yoast : 'yoast'

};

// ==================================================================================================================

tulip.EventType = {
  TLP_DELETE : 0,
  TLP_MODIFICATION : 1,
  TLP_INFORMATION : 2,
  TLP_INVALID : 3
};

tulip.Event = function tulip_Event(sender, type) {
  var newObject = createObject(tulip.Event, this);
  if (tulip_Event.caller == null || tulip_Event.caller.name != 'createObject') {
    newObject.sender = sender;
    newObject.type = type;
  }
  return newObject;
};
tulip.Event.prototype.getSender = function() {
  return this.sender;
};
tulip.Event.prototype.getType = function() {
  return this.type;
};

tulip.GraphEventType = {
  TLP_ADD_NODE : 0,
  TLP_DEL_NODE : 1,
  TLP_ADD_EDGE : 2,
  TLP_DEL_EDGE : 3,
  TLP_REVERSE_EDGE : 4,
  TLP_BEFORE_SET_ENDS : 5,
  TLP_AFTER_SET_ENDS : 6,
  TLP_ADD_NODES : 7,
  TLP_ADD_EDGES : 8,
  TLP_BEFORE_ADD_DESCENDANTGRAPH : 9,
  TLP_AFTER_ADD_DESCENDANTGRAPH : 10,
  TLP_BEFORE_DEL_DESCENDANTGRAPH : 11,
  TLP_AFTER_DEL_DESCENDANTGRAPH : 12,
  TLP_BEFORE_ADD_SUBGRAPH : 13,
  TLP_AFTER_ADD_SUBGRAPH : 14,
  TLP_BEFORE_DEL_SUBGRAPH : 15,
  TLP_AFTER_DEL_SUBGRAPH : 16,
  TLP_ADD_LOCAL_PROPERTY : 17,
  TLP_BEFORE_DEL_LOCAL_PROPERTY : 18,
  TLP_AFTER_DEL_LOCAL_PROPERTY : 19,
  TLP_ADD_INHERITED_PROPERTY : 20,
  TLP_BEFORE_DEL_INHERITED_PROPERTY : 21,
  TLP_AFTER_DEL_INHERITED_PROPERTY : 22,
  TLP_BEFORE_RENAME_LOCAL_PROPERTY : 23,
  TLP_AFTER_RENAME_LOCAL_PROPERTY : 24,
  TLP_BEFORE_SET_ATTRIBUTE : 25,
  TLP_AFTER_SET_ATTRIBUTE : 26,
  TLP_REMOVE_ATTRIBUTE : 27,
  TLP_BEFORE_ADD_LOCAL_PROPERTY : 28,
  TLP_BEFORE_ADD_INHERITED_PROPERTY : 29
};

tulip.GraphEvent = function tulip_GraphEvent(graph, eventType) {
  var newObject = createObject(tulip.GraphEvent, this);
  if (tulip_GraphEvent.caller == null || tulip_GraphEvent.caller.name != 'createObject') {
    newObject.graph = graph;
    newObject.eventType = eventType;
    newObject.node = null;
    newObject.edge = null;
    newObject.name = null;
    newObject.nodes = null;
    newObject.edges = null;
    newObject.subgraph = null;
    newObject.property = null;
    tulip.Event.call(newObject, graph, tulip.EventType.TLP_MODIFICATION);
  }
  return newObject;
};

tulip.GraphEvent.inheritsFrom(tulip.Event);

tulip.GraphEvent.prototype.getGraph = function() {
  return this.graph;
};

tulip.GraphEvent.prototype.getEventType = function() {
  return this.eventType;
};

tulip.GraphEvent.prototype.getNode = function() {
  return this.node;
};

tulip.GraphEvent.prototype.getEdge = function() {
  return this.edge;
};

tulip.GraphEvent.prototype.getNodes = function() {
  return this.nodes;
};

tulip.GraphEvent.prototype.getEdges = function() {
  return this.edges;
};

tulip.GraphEvent.prototype.getSubGraph = function() {
  return this.subgraph;
};

tulip.GraphEvent.prototype.getAttributeName = function() {
  return this.name;
};

tulip.GraphEvent.prototype.getPropertyName = function() {
  return this.name;
};

tulip.GraphEvent.prototype.getProperty = function() {
  return this.property;
};
// ==================================================================================================================

tulip.PropertyEventType = {
  TLP_BEFORE_SET_NODE_VALUE: 0,
  TLP_AFTER_SET_NODE_VALUE: 1,
  TLP_BEFORE_SET_ALL_NODE_VALUE : 2,
  TLP_AFTER_SET_ALL_NODE_VALUE : 3,
  TLP_BEFORE_SET_ALL_EDGE_VALUE : 4,
  TLP_AFTER_SET_ALL_EDGE_VALUE : 5,
  TLP_BEFORE_SET_EDGE_VALUE : 6,
  TLP_AFTER_SET_EDGE_VALUE : 7
};

tulip.PropertyEvent = function tulip_PropertyEvent(prop, eventType) {
  var newObject = createObject(tulip.PropertyEvent, this);
  if (tulip_PropertyEvent.caller == null || tulip_PropertyEvent.caller.name != 'createObject') {
    newObject.property = prop;
    newObject.eventType = eventType;
    newObject.node = null;
    newObject.edge = null;
    tulip.Event.call(newObject, prop, tulip.EventType.TLP_MODIFICATION);
  }
  return newObject;
};

tulip.PropertyEvent.inheritsFrom(tulip.Event);

tulip.PropertyEvent.prototype.getProperty = function() {
  return this.property;
};

tulip.PropertyEvent.prototype.getEventType = function() {
  return this.eventType;
};

tulip.PropertyEvent.prototype.getNode = function() {
  return this.node;
};

tulip.PropertyEvent.prototype.getEdge = function() {
  return this.edge;
};

// ==================================================================================================================

var tulipListeners = {};
var tulipObservers = {};

tulip.addListener = function(sender, listener) {
  checkArgumentsTypes(arguments, [[tulip.Graph, tulip.PropertyInterface], ['function', 'object']], 2);
  if (!tulipListeners.hasOwnProperty(sender.cppPointer)) {
    tulipListeners[sender.cppPointer] = [];
  }
  tulipListeners[sender.cppPointer].push(listener);
};

tulip.removeListener = function(sender, listener) {
  checkArgumentsTypes(arguments, [[tulip.Graph, tulip.PropertyInterface], ['function', 'object']], 2);
  if (!tulipListeners.hasOwnProperty(sender.cppPointer)) {
    return;
  }
  for (var i = 0, len = tulipListeners[sender.cppPointer].length ; i < len ; i++) {
    if (tulipListeners[sender.cppPointer][i] === listener) {
      tulipListeners[sender.cppPointer].splice(i, 1);
      if (tulipListeners[sender.cppPointer].length == 0) {
        delete tulipListeners[sender.cppPointer];
      }
      break;
    }
  }
};

tulip.hasListener = function(senderId) {
  return tulipListeners.hasOwnProperty(senderId);
};

tulip.addObserver = function(sender, observer) {
  checkArgumentsTypes(arguments, [[tulip.Graph, tulip.PropertyInterface], ['function', 'object']], 2);
  if (!tulipObservers.hasOwnProperty(sender.cppPointer)) {
    tulipObservers[sender.cppPointer] = [];
  }
  tulipObservers[sender.cppPointer].push(observer);
};

tulip.removeObserver = function(sender, observer) {
  checkArgumentsTypes(arguments, [[tulip.Graph, tulip.PropertyInterface], ['function', 'object']], 2);
  if (!tulipObservers.hasOwnProperty(sender.cppPointer)) {
    return;
  }
  for (var i = 0, len = tulipObservers[sender.cppPointer].length ; i < len ; i++) {
    if (tulipObservers[sender.cppPointer][i] === observer) {
      tulipObservers[sender.cppPointer].splice(i, 1);
      if (tulipObservers[sender.cppPointer].length == 0) {
        delete tulipObservers[sender.cppPointer];
      }
      break;
    }
  }
};

tulip.hasObserver = function(senderId) {
  return tulipObservers.hasOwnProperty(senderId);
};

tulip.sendEventToListeners = function(senderId, event) {
  if (!tulipListeners.hasOwnProperty(senderId)) {
    return;
  }
  for (var i = 0, len = tulipListeners[senderId].length ; i < len ; i++) {
    if (typeOf(tulipListeners[senderId][i]) == 'function') {
      tulipListeners[senderId][i](event);
    } else if (typeOf(tulipListeners[senderId][i]) == 'object' && typeOf(tulipListeners[senderId][i].treatEvent) == 'function') {
      tulipListeners[senderId][i].treatEvent(event);
    }
  }
};

tulip.sendEventsToObservers = function(events) {
  var observerEvents = {};
  var observers = [];

  for (var senderId in tulipObservers) {
    if (tulipObservers.hasOwnProperty(senderId)) {
      for (var j = 0 ; j < tulipObservers[senderId].length ; ++j) {
        var observer = tulipObservers[senderId][j];
        if (observers.indexOf(observer) == -1) {
          observers.push(observer);
        }
      }
    }
  }

  for (var i = 0 ; i < events.length ; ++i) {
    for (var senderId in tulipObservers) {
      if (tulipObservers.hasOwnProperty(senderId)) {
        for (var j = 0 ; j < tulipObservers[senderId].length ; ++j) {
          var key = observers.indexOf(tulipObservers[senderId][j]);
          if (events[i].getSender().cppPointer.toString() == senderId) {
            if (!observerEvents.hasOwnProperty(key)) {
              observerEvents[key] = [];
            }
            observerEvents[key].push(events[i]);
          }
        }
      }
    }
  }

  for (var observerIdx in observerEvents) {
    var observer = observers[parseInt(observerIdx)];
    if (typeOf(observer) == 'function') {
      observer(observerEvents[observerIdx]);
    } else if (typeOf(observer) == 'object' && typeOf(observer.treatEvents) == 'function') {
      observer.treatEvents(observerEvents[observerIdx]);
    }
  }


};

// ==================================================================================================================

var _setSeedOfRandomSequence = Module.cwrap('setSeedOfRandomSequence', null, ['number']);

var _getSeedOfRandomSequence = Module.cwrap('getSeedOfRandomSequence', 'number', []);

var _initRandomSequence = Module.cwrap('initRandomSequence', null, []);

var _randomInteger = Module.cwrap('randomInteger', 'number', ['number']);

var _randomUnsignedInteger = Module.cwrap('randomUnsignedInteger', 'number', ['number']);

var _randomDouble = Module.cwrap('randomDouble', 'number', ['number']);

tulip.setSeedOfRandomSequence = function(seed) {
  checkArgumentsTypes(arguments, ['number'], 1);
  _setSeedOfRandomSequence(seed | 0);
};

tulip.getSeedOfRandomSequence = function() {
  return _getSeedOfRandomSequence();
};

tulip.initRandomSequence = function() {
  _initRandomSequence();
};

tulip.randomInteger = function(bound) {
  checkArgumentsTypes(arguments, ['number'], 1);
  return _randomInteger(bound | 0);
};

tulip.randomUnsigedInteger = function(bound) {
  checkArgumentsTypes(arguments, ['number'], 1);
  return _randomUnsignedInteger(bound | 0);
};

tulip.randomDouble = function(max) {
  checkArgumentsTypes(arguments, ['number'], 1);
  return _randomDouble(max);
};

// ==================================================================================================================

if (workerMode) {

  var graphs = {};

  var sendGraphToMainThread = function(graph, graphHierarchyId, graphId, algoSucceed) {
    var graphFilePath = '/';
    var graphFileName = 'graph.tlpb.gz';
    var graphFileCompletePath = graphFilePath + graphFileName;
    var file = FS.findObject(graphFileCompletePath);
    if (!file) {
      FS.createFile(graphFilePath, graphFileName, {}, true, true);
    }
    var saved = tulip.saveGraph(graph, graphFileCompletePath);
    var graphFileData = FS.readFile(graphFileCompletePath);
    FS.unlink(graphFileCompletePath);
    graph.destroy();
    delete graphs[graphHierarchyId];

    var messageData = {
      eventType: 'loadGraph',
      graphHierarchyId: graphHierarchyId,
      graphId: graphId,
      graphFile: graphFileCompletePath,
      graphFileData : graphFileData.buffer,
      algoSucceed : algoSucceed
    };

    self.postMessage(messageData, [messageData.graphFileData]);
  };

  function loadGraph(graphHierarchyId, graphFilePath, sendData) {
    _setPluginProgressGraphId(graphHierarchyId);
    graphs[graphHierarchyId] = tulip.loadGraph(graphFilePath, sendData);
    if (!sendData) return;
    sendGraphToMainThread(graphs[graphHierarchyId], graphHierarchyId);
  }

  self.addEventListener('message', function(e) {
    var data = e.data;
    if (!data) return;
    switch (data.eventType) {
    case 'loadGraph':
      if (!data.graphFileData) {
        var graphReq = new XMLHttpRequest();
        graphReq.open('GET', data.graphFile, true);
        graphReq.responseType = 'arraybuffer';
        graphReq.onload = function (oEvent) {
          var arrayBuffer = graphReq.response;
          var file = FS.findObject(data.graphFile);
          if (!file) {
            var paths = data.graphFile.split('/');
            var filePath = '/';
            for (var i = 0; i < paths.length - 1; ++i) {
              filePath += paths[i];
              filePath += '/';
            }
            FS.createPath('/', filePath, true, true);
            FS.createFile('/', data.graphFile, {}, true, true);
          }
          FS.writeFile(data.graphFile, new Uint8Array(arrayBuffer), {'encoding' : 'binary'});
          var graphToDestroy = null;
          if (data.graphHierarchyId in graphs) {
            graphToDestroy = graphs[data.graphHierarchyId];
          }
          loadGraph(data.graphHierarchyId, data.graphFile, data.sendDataBack);
          if (graphToDestroy) graphToDestroy.destroy();
        };
        graphReq.send(null);
      } else {
        var file = FS.findObject('/' + data.graphFile);
        if (!file) {
          var paths = data.graphFile.split('/');
          var filePath = '/';
          for (var i = 0; i < paths.length - 1; ++i) {
            filePath += paths[i];
            filePath += '/';
          }
          FS.createPath('/', filePath, true, true);
          FS.createFile('/', data.graphFile, {}, true, true);
        }
        FS.writeFile('/' + data.graphFile, new Uint8Array(data.graphFileData), {'encoding' : 'binary'});
        var graphToDestroy = null;
        if (data.graphHierarchyId in graphs) {
          graphToDestroy = graphs[data.graphHierarchyId];
        }
        loadGraph(data.graphHierarchyId, data.graphFile, data.sendDataBack);
        FS.unlink(data.graphFile);
        if (graphToDestroy) graphToDestroy.destroy();
      }
      break;
    case 'algorithm' :
      _setPluginProgressGraphId(data.graphHierarchyId);
      var graph = graphs[data.graphHierarchyId];
      if (data.graphId != 0) {
        graph =  graph.getDescendantGraph(data.graphId);
      }
      var algoSucceed = graph.applyAlgorithm(data.algorithmName, JSON.parse(data.parameters), true);
      sendGraphToMainThread(graph.getRoot(), data.graphHierarchyId, data.graphId, algoSucceed);
      break;
    case 'propertyAlgorithm' :
      _setPluginProgressGraphId(data.graphHierarchyId);
      var graph = graphs[data.graphHierarchyId];
      if (data.graphId != 0) {
        graph =  graph.getDescendantGraph(data.graphId);
      }
      var resultProp = graph.getProperty(data.resultPropertyName);
      var algoSucceed = graph.applyPropertyAlgorithm(data.algorithmName, resultProp, JSON.parse(data.parameters), true);
      sendGraphToMainThread(graph.getRoot(), data.graphHierarchyId, data.graphId, algoSucceed);
      break;
    case 'executeGraphScript' :
      _setPluginProgressGraphId(data.graphHierarchyId);
      var graph = graphs[data.graphHierarchyId];
      if (data.graphId != 0) {
        graph =  graph.getDescendantGraph(data.graphId);
      }
      var scriptSucceed = true;
      try {
        eval('f = ' + data.scriptCode + '; f(graph, data.graphHierarchyId, ' + JSON.stringify(data.scriptParameters) + ' );');
      } catch (e) {
        console.log('exception caught');
        console.log(e);
        scriptSucceed = false;
      }
      sendGraphToMainThread(graph.getRoot(), data.graphHierarchyId, data.graphId, scriptSucceed);
      break;
    }
  }, false);

  tulip.sendProgressValue = function(graphHierarchyId, val) {
    self.postMessage({eventType: 'progressValue', graphHierarchyId : graphHierarchyId, value: val});
  };

  tulip.sendProgressComment = function(graphHierarchyId, text) {
    self.postMessage({eventType: 'progressComment', graphHierarchyId : graphHierarchyId, comment: text});
  };

} else {

  // ===================================================================================================================

  var graphLoadedCallbacks = {};
  var algorithmFinishedCallbacks = {};
  var graphHierarchyIdToWrapper = {};

  if (tulip.vizFeatures) {

    var _centerScene = Module.cwrap('centerScene', null, ['string']);
    var _setGraphRenderingDataReady = Module.cwrap('setGraphRenderingDataReady', null, ['string', 'number']);

    var _activateInteractor = Module.cwrap('activateInteractor', null, ['string', 'string']);
    var _desactivateInteractor = Module.cwrap('desactivateInteractor', null, ['string']);

    var _initCanvas = Module.cwrap('initCanvas', null, ['string', 'number', 'number', 'number']);
    var _setCurrentCanvas = Module.cwrap('setCurrentCanvas', null, ['string']);
    var _getCurrentCanvas = Module.cwrap('getCurrentCanvas', 'string', []);
    var _resizeCanvas = Module.cwrap('resizeCanvas', null, ['string', 'number', 'number', 'number']);
    var _fullScreen = Module.cwrap('fullScreen', null, ['string']);
    var _updateGlScene = Module.cwrap('updateGlScene', null, ['string']);
    var _graphHasHull = Module.cwrap('graphHasHull', 'number', ['string', 'number']);
    var _addGraphHull = Module.cwrap('addGraphHull', null, ['string', 'number', 'number']);
    var _setGraphsHullsVisible = Module.cwrap('setGraphsHullsVisible', null, ['string', 'number', 'number']);
    var _clearGraphsHulls = Module.cwrap('clearGraphsHulls', null, ['string']);

    var _selectNodes = Module.cwrap('selectNodes', 'number', ['string', 'number', 'number', 'number', 'number']);
    var _getSelectedNodes = Module.cwrap('getSelectedNodes', null, ['number']);
    var _selectEdges = Module.cwrap('selectEdges', 'number', ['string', 'number', 'number', 'number', 'number']);
    var _getSelectedEdges = Module.cwrap('getSelectedEdges', null, ['number']);
    var _addSubGraphsHulls = Module.cwrap('addSubGraphsHulls', null, ['string']);

    var graphHierarchyIdToView = {};
    var canvasIdToView = {};
    var graphData = {};

    tulip.getViewForCanvasId = function(canvasId) {
      return canvasIdToView[canvasId];
    };

  }

  if (!nodejs) {

    function createTulipWebWorker() {

      var tulipWorkerInit = false;

      var tulipWorker = new Worker(tulip.modulePrefixURL + scriptName);

      tulipWorker.addEventListener('message', function (event) {
        var delay = 0;
        var view = null;
        var graphHierarchyId = null;
        var graphId = null;
        var graph = null;
        if ('graphHierarchyId' in event.data) {
          graphHierarchyId = event.data.graphHierarchyId;
          graphId = event.data.graphId;
          graph = graphHierarchyIdToWrapper[graphHierarchyId];
        }
        if (tulip.vizFeatures && graphHierarchyId) {
          view = graphHierarchyIdToView[graphHierarchyId];
        }
        switch (event.data.eventType) {
        case 'tulipWorkerInit':
          tulipWorkerInit = true;
          break;
        case 'print':
          console.log(event.data.text);
          break;
        case 'progressValue':
          if (tulip.vizFeatures && view) {
            view.stopBusyAnimation();
            view.setProgressBarPercent(event.data.value);
            if (event.data.value >= 0) {
              view.draw();
            } else {
              view.startBusyAnimation();
            }
          }
          break;
        case 'progressComment':
          if (tulip.vizFeatures && view) {
            view.setProgressBarComment(event.data.comment);
            view.draw();
          }
          break;
        case 'loadGraph':
          var file = FS.findObject(event.data.graphFile);
          if (!file) {
            var paths = event.data.graphFile.split('/');
            var filePath = '/';
            for (var i = 0; i < paths.length - 1; ++i) {
              filePath += paths[i];
              filePath += '/';
            }
            FS.createPath('/', filePath, true, true);
            FS.createFile('/', event.data.graphFile, {}, true, true);
          }
          FS.writeFile('/' + event.data.graphFile, new Uint8Array(event.data.graphFileData), {'encoding' : 'binary'});
          _Graph_loadFromTLPBFile(graph.cppPointer, event.data.graphFile);
          FS.unlink(event.data.graphFile);
          if (tulip.vizFeatures && view) {
            view.stopBusyAnimation();
            view.setGraphRenderingDataReady(true);
            view.centerScene();
            view.draw();
          }
          if (graphHierarchyId in graphLoadedCallbacks) {
            graphLoadedCallbacks[graphHierarchyId](graph);
            delete graphLoadedCallbacks[graphHierarchyId];
          }
          if (graphHierarchyId in algorithmFinishedCallbacks) {
            var g = graph;
            if (graphId != 0) {
              g = graph.getDescendantGraph(graphId);
            }
            algorithmFinishedCallbacks[graphHierarchyId](g, event.data.algoSucceed);
            delete algorithmFinishedCallbacks[graphHierarchyId];
          }
          tulipWorker.terminate();
          tulipWorker = null;
          break;
        }
      }, false);

      return new Promise(function(resolve, reject) {
        function checkWorkerInit() {
          if (tulipWorkerInit) {
            resolve(tulipWorker);
          } else {
            setTimeout(checkWorkerInit);
          }
        }
        checkWorkerInit();
      });
    }

    function sendGraphToWorker(graph, graphFilePath, graphFileData, sendDataBack) {
      if (arguments.length == 1) {
        var file = FS.findObject('/graph.tlpb.gz');
        if (!file) {
          FS.createFile('/', 'graph.tlpb.gz', {}, true, true);
        }
        var saved = tulip.saveGraph(graph, '/graph.tlpb.gz');
        var graphData = FS.readFile('/graph.tlpb.gz');
        FS.unlink('/graph.tlpb.gz');
        return sendGraphToWorker(graph, 'graph.tlpb.gz', graphData.buffer, false);
      } else {
        var messageData = {
          eventType: 'loadGraph',
          graphHierarchyId: graph.getCppPointer(),
          graphFile: graphFilePath,
          graphFileData : graphFileData,
          sendDataBack : sendDataBack
        };
        return createTulipWebWorker().then(function(tulipWorker) {
          if (graphFileData) {
            tulipWorker.postMessage(messageData, [messageData.graphFileData]);
          } else {
            tulipWorker.postMessage(messageData);
          }
          return tulipWorker;
        });
      }
    }

  }

  // ==================================================================================================================

  if (tulip.vizFeatures) {

    function addStyleString(str) {
      var node = document.createElement('style');
      node.innerHTML = str;
      document.body.appendChild(node);
    }

    addStyleString(' \
    .centerFlex { \
       align-items: center; \
       display: flex; \
       justify-content: center; \
    }');

    function addHTMLProgressBarToView(view) {
      view.canvasOverlayDiv = document.createElement('div');
      view.canvasOverlayDiv.style.position = 'absolute';
      view.canvasOverlayDiv.style.top = '0';
      view.canvasOverlayDiv.style.left = '0';
      view.canvasOverlayDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
      if (view.sizeRelativeToContainer) {
        view.canvasOverlayDiv.style.width = '100%';
        view.canvasOverlayDiv.style.height = '100%';
      } else {
        view.canvasOverlayDiv.style.width = view.canvas.width + 'px';
        view.canvasOverlayDiv.style.height = view.canvas.height + 'px';
      }

      view.canvasOverlayDiv.style.display = 'none';
      view.container.appendChild(view.canvasOverlayDiv);

      view.progress = document.createElement('progress');
      view.progress.max = '100';
      view.progress.style.width = '100%';
      view.progress.style.height = '30px';

      view.progressComment = document.createElement('p');
      view.progressComment.style.color = '#000000';
      view.progressComment.style.textAlign = 'center';

      var progressDiv = document.createElement('div');
      progressDiv.style.width = '70%';
      progressDiv.appendChild(view.progressComment);
      progressDiv.appendChild(view.progress);

      view.canvasOverlayDiv.classList.add('centerFlex');
      view.canvasOverlayDiv.appendChild(progressDiv);
    }

    var _setCanvasGraph = Module.cwrap('setCanvasGraph', null, ['string', 'number', 'number']);
    var _getViewRenderingParameters = Module.cwrap('getViewRenderingParameters', 'number', ['string']);
    var _getViewInputData = Module.cwrap('getViewInputData', 'number', ['string']);
    var _getViewCamera = Module.cwrap('getViewCamera', 'number', ['string']);
    var _setViewBackgroundColor = Module.cwrap('setViewBackgroundColor', null, ['string', 'number', 'number', 'number', 'number']);
    var _setViewBackupBackBuffer = Module.cwrap('setViewBackupBackBuffer', null, ['string', 'number']);

    var nextCanvasId = 0;

    tulip.View = function(container, width, height) {
      var newObject = createObject(tulip.View, this);
      newObject.canvasOverlayDiv = null;
      if (arguments.length > 0) {
        if (typeof(container) == 'string') {
          newObject.container = document.getElementById(container);
        } else {
          newObject.container = container;
        }

        if (newObject.container.tagName == 'DIV') {
          newObject.container.style.position = 'relative';

          var currentId = nextCanvasId++;

          newObject.canvasId = 'tulip-canvas-' + currentId;
          newObject.canvas = document.createElement('canvas');
          newObject.canvas.style.outline = 'none';
          newObject.canvas.style.position = 'absolute';
          newObject.canvas.style.top = '0';
          newObject.canvas.style.left = '0';
          newObject.canvas.id = newObject.canvasId;
          newObject.canvas.tabIndex = -1;
          newObject.container.appendChild(newObject.canvas);
          if (typeOf(width) != 'undefined' && typeOf(height) != 'undefined') {
            newObject.sizeRelativeToContainer = false;
          } else {
            newObject.sizeRelativeToContainer = true;
            newObject.canvas.style.width = '100%';
            newObject.canvas.style.height = '100%';
            width = newObject.container.clientWidth;
            height = newObject.container.clientHeight;
          }
        } else if (newObject.container.tagName == 'CANVAS') {
          newObject.canvas = newObject.container;
          newObject.container = null;
          if (newObject.canvas.id != '') {
            newObject.canvasId = newObject.canvas.id;
          } else {
            newObject.canvas.id = 'tulip-canvas-' + nextCanvasId++;
            newObject.canvasId = newObject.canvas.id;
          }
          newObject.sizeRelativeToContainer = false;
          width = newObject.canvas.width;
          height = newObject.canvas.height;
        }

        _initCanvas(newObject.canvasId, width, height, newObject.sizeRelativeToContainer);

        if (newObject.container) {
          addHTMLProgressBarToView(newObject);
        }

        newObject.graph = null;
        newObject.graphDrawingChanged = false;
        canvasIdToView[newObject.canvasId] = newObject;
      }
      newObject.fullScreenActivated = false;
      newObject.busyAnimationStarted = false;
      return newObject;
    };

    tulip.View.prototype.makeCurrent = function() {
      _setCurrentCanvas(this.canvasId);
    };

    tulip.View.prototype.updateGlScene = function() {
      _updateGlScene(this.canvasId);
    };

    tulip.View.prototype.setBackgroundColor = function(color) {
      checkArgumentsTypes(arguments, [tulip.Color]);
      _setViewBackgroundColor(this.canvasId, color.r, color.g, color.b, color.a);
    };

    tulip.View.prototype.setBackupBackBuffer = function(backup) {
      checkArgumentsTypes(arguments, ['boolean']);
      _setViewBackupBackBuffer(this.canvasId, backup);
    };

    tulip.View.prototype.draw = function() {
      if (this.sizeRelativeToContainer && !this.fullScreenActivated) {
        _resizeCanvas(this.canvasId, this.container.clientWidth, this.container.clientHeight, this.sizeRelativeToContainer);
      }
      var view = this;
      Browser.requestAnimationFrame(function() {
        view.makeCurrent();
        view.updateGlScene();
      });
    };

    tulip.View.prototype.setProgressBarComment = function(comment) {
      if (this.canvasOverlayDiv) {
        this.canvasOverlayDiv.style.display = '';
        this.progressComment.innerHTML = comment;
      }
    };

    tulip.View.prototype.setProgressBarPercent = function(percent) {
      if (this.canvasOverlayDiv) {
        this.canvasOverlayDiv.style.display = '';
        this.progress.value = percent;
      }
    };

    tulip.View.prototype.startBusyAnimation = function() {
      if (this.busyAnimationStarted) {
        return;
      }

      if (this.canvasOverlayDiv) {
        this.canvasOverlayDiv.style.display = '';
        this.progress.removeAttribute('value');
        this.busyAnimationStarted = true;
      }
    };

    tulip.View.prototype.stopBusyAnimation = function(canvasId) {
      this.busyAnimationStarted = false;
      this.canvasOverlayDiv.style.display = 'none';
    };

    tulip.View.prototype.activateInteractor = function(interactorName) {
      _activateInteractor(this.canvasId, interactorName);
    };

    tulip.View.prototype.desactivateInteractor = function() {
      _desactivateInteractor(this.canvasId);
    };

    tulip.View.prototype.centerScene = function() {
      _centerScene(this.canvasId);
    };

    tulip.View.prototype.fullScreen = function() {
      _fullScreen(this.canvasId);
    };

    tulip.View.prototype.resize = function(width, height) {
      if (!width && this.sizeRelativeToContainer) {
        width = this.container.clientWidth;
      }
      if (!height && this.sizeRelativeToContainer) {
        height = this.container.clientHeight;
      }
      _resizeCanvas(this.canvasId, width, height, this.sizeRelativeToContainer);
      if (!this.sizeRelativeToConatiner) {
        this.canvasOverlayDiv.style.width = width + 'px';
        this.canvasOverlayDiv.style.height = height + 'px';
      }
    };

    tulip.View.prototype.getWidth = function() {
      return this.canvas.width;
    };

    tulip.View.prototype.getHeight = function() {
      return this.canvas.height;
    };

    tulip.View.prototype.setGraph = function(graph, viewTakesGraphOwnership) {
      if (!graph.cppPointerValid()) return;
      this.graph = graph;
      _setCanvasGraph(this.canvasId, graph.cppPointer, viewTakesGraphOwnership);
      graphHierarchyIdToView[graph.getRoot().getCppPointer()] = this;
      graphHierarchyIdToWrapper[graph.getRoot().getCppPointer()] = graph.getRoot();
    };

    tulip.View.prototype.getGraph = function() {
      return this.graph;
    };

    tulip.View.prototype.loadGraphFromFile = function(graphFilePath, loadGraphInWorker, graphLoadedCallback) {

      var view = this;
      var graphReq = new XMLHttpRequest();
      graphReq.open('GET', graphFilePath, true);
      graphReq.responseType = 'arraybuffer';
      graphReq.onload = function (oEvent) {
        var arrayBuffer = graphReq.response;
        var paths = graphFilePath.split('/');
        if (loadGraphInWorker) {
          view.loadGraphFromData(paths[paths.length-1], arrayBuffer, loadGraphInWorker, graphLoadedCallback);
        } else {
          var file = FS.findObject(graphFilePath);
          if (!file) {
            var filePath = '/';
            for (var i = 0; i < paths.length - 1; ++i) {
              filePath += paths[i];
              filePath += '/';
            }
            FS.createPath('/', filePath, true, true);
            FS.createFile('/', graphFilePath, {}, true, true);
          }
          FS.writeFile(graphFilePath, new Uint8Array(arrayBuffer), {'encoding' : 'binary'});
          var graph = tulip.loadGraph(graphFilePath, false);
          FS.unlink(graphFilePath);
          view.setGraph(graph, true);
          if (graphLoadedCallback) {
            graphLoadedCallback(view.graph);
          }
        }
      };
      graphReq.send(null);
    };

    tulip.View.prototype.loadGraphFromData = function(graphFilePath, graphFileData, loadGraphInWorker, graphLoadedCallback) {
      var view = this;
      if (loadGraphInWorker) {
        var graph = tulip.Graph();
        view.setGraph(graph, true);
        if (graphLoadedCallback) {
          graphLoadedCallbacks[view.graph.getCppPointer()] = graphLoadedCallback;
        }
        this.setGraphRenderingDataReady(false);
        sendGraphToWorker(view.graph, graphFilePath, graphFileData, true);
      } else {
        var file = FS.findObject(graphFilePath);
        if (!file) {
          var paths = graphFilePath.split('/');
          var filePath = '/';
          for (var i = 0; i < paths.length - 1; ++i) {
            filePath += paths[i];
            filePath += '/';
          }
          FS.createPath('/', filePath, true, true);
          FS.createFile('/', graphFilePath, {}, true, true);
        }
        FS.writeFile(graphFilePath, new Uint8Array(graphFileData), {'encoding' : 'binary'});
        var graph = tulip.loadGraph(graphFilePath, false);
        FS.unlink(graphFilePath);
        view.setGraph(graph, true);
        if (graphLoadedCallback) {
          graphLoadedCallback(view.graph);
        }
      }
    };

    tulip.View.prototype.setGraphRenderingDataReady = function(ready) {
      _setGraphRenderingDataReady(this.canvasId, ready);
      this.canvasOverlayDiv.style.display = ready ? 'none' : '';
    };

    tulip.View.prototype.selectNodesEdges = function(x, y, w, h) {
      if (w == undefined) {
        w = 0;
        h = 0;
      }
      var nbNodes = _selectNodes(this.canvasId, x, y, w, h);
      var nbEdges = _selectEdges(this.canvasId, x, y, w, h);
      var selectedNodes = [];
      var selectedEdges = [];

      if (nbNodes > 0) {
        selectedNodes = getArrayOfTulipType(nbNodes, function(byteOffset) {_getSelectedNodes(byteOffset);}, tulip.Node);
      }

      if (nbEdges > 0) {
        selectedEdges = getArrayOfTulipType(nbEdges, function(byteOffset) {_getSelectedEdges(byteOffset);}, tulip.Edge);
      }

      return {nodes: selectedNodes, edges: selectedEdges};

    };

    tulip.View.prototype.getRenderingParameters = function() {
      return tulip.GlGraphRenderingParameters(_getViewRenderingParameters(this.canvasId));
    };

    tulip.View.prototype.getInputData = function() {
      return tulip.GlGraphInputData(_getViewInputData(this.canvasId));
    };

    tulip.View.prototype.getCamera = function() {
      return tulip.Camera(_getViewCamera(this.canvasId));
    };

    tulip.View.prototype.graphHasHull = function(graph) {
      checkArgumentsTypes(arguments, [tulip.Graph], 1);
      return _graphHasHull(this.canvasId, graph.cppPointer) > 0;
    };

    tulip.View.prototype.addGraphHull = function(graph) {
      checkArgumentsTypes(arguments, [tulip.Graph], 1);
      _addGraphHull(this.canvasId, graph.cppPointer, true);
    };

    tulip.View.prototype.clearGraphsHulls = function() {
      _clearGraphsHulls(this.canvasId);
    };

    tulip.View.prototype.computeSubGraphsHulls = function(subgraphsList) {
      _clearGraphsHulls(this.canvasId);
      var view = this;
      var subgraphs = this.graph.getSubGraphs();
      if (typeOf(subgraphsList) == 'array') {
        subgraphs = subgraphsList;
      }
      subgraphs.forEach(function(sg) {
        if (view.graphHasHull(sg)) {
          setTimeout(
            function(g) {
              return function() {
                view.addGraphHull(g);
                view.draw();
              };
            }(sg)
          );
        }
      });
    };

    tulip.View.prototype.setGraphsHullsVisible = function(visible, onTop) {
      checkArgumentsTypes(arguments, ['boolean', 'boolean']);
      if (typeOf(visible) == 'undefined') {
        visible = true;
      }
      if (typeOf(onTop) == 'undefined') {
        onTop = true;
      }
      _setGraphsHullsVisible(this.canvasId, visible, onTop);
      this.draw();
    };

    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    tulip.View.prototype.getViewSnapshotBlob = function() {
      return dataURItoBlob(this.canvas.toDataURL());
    };

    tulip.View.prototype.addSubGraphsHulls = function() {
      _addSubGraphsHulls(this.canvasId);
    };

    // ==================================================================================================

    var _GlGraphRenderingParameters_setDisplayNodes = Module.cwrap('GlGraphRenderingParameters_setDisplayNodes', null, ['number', 'number']);
    var _GlGraphRenderingParameters_displayNodes = Module.cwrap('GlGraphRenderingParameters_displayNodes', 'number', ['number']);
    var _GlGraphRenderingParameters_setBillboardedNodes = Module.cwrap('GlGraphRenderingParameters_setBillboardedNodes', null, ['number', 'number']);
    var _GlGraphRenderingParameters_billboardedNodes = Module.cwrap('GlGraphRenderingParameters_billboardedNodes', 'number', ['number']);
    var _GlGraphRenderingParameters_setDisplayNodesLabels = Module.cwrap('GlGraphRenderingParameters_setDisplayNodesLabels', null, ['number', 'number']);
    var _GlGraphRenderingParameters_displayNodesLabels = Module.cwrap('GlGraphRenderingParameters_displayNodesLabels', 'number', ['number']);
    var _GlGraphRenderingParameters_setLabelsScaled = Module.cwrap('GlGraphRenderingParameters_setLabelsScaled', null, ['number', 'number']);
    var _GlGraphRenderingParameters_labelsScaled = Module.cwrap('GlGraphRenderingParameters_labelsScaled', 'number', ['number']);
    var _GlGraphRenderingParameters_setDisplayEdges = Module.cwrap('GlGraphRenderingParameters_setDisplayEdges', null, ['number', 'number']);
    var _GlGraphRenderingParameters_displayEdges = Module.cwrap('GlGraphRenderingParameters_displayEdges', 'number', ['number']);
    var _GlGraphRenderingParameters_setInterpolateEdgesColors = Module.cwrap('GlGraphRenderingParameters_setInterpolateEdgesColors', null, ['number', 'number']);
    var _GlGraphRenderingParameters_interpolateEdgesColors = Module.cwrap('GlGraphRenderingParameters_interpolateEdgesColors', 'number', ['number']);
    var _GlGraphRenderingParameters_setInterpolateEdgesSizes = Module.cwrap('GlGraphRenderingParameters_setInterpolateEdgesSizes', null, ['number', 'number']);
    var _GlGraphRenderingParameters_interpolateEdgesSizes = Module.cwrap('GlGraphRenderingParameters_interpolateEdgesSizes', 'number', ['number']);
    var _GlGraphRenderingParameters_setDisplayEdgesExtremities = Module.cwrap('GlGraphRenderingParameters_setDisplayEdgesExtremities', null, ['number', 'number']);
    var _GlGraphRenderingParameters_displayEdgesExtremities = Module.cwrap('GlGraphRenderingParameters_displayEdgesExtremities', 'number', ['number']);
    var _GlGraphRenderingParameters_setEdges3D = Module.cwrap('GlGraphRenderingParameters_setEdges3D', null, ['number', 'number']);
    var _GlGraphRenderingParameters_edges3D = Module.cwrap('GlGraphRenderingParameters_edges3D', 'number', ['number']);
    var _GlGraphRenderingParameters_setMinSizeOfLabels = Module.cwrap('GlGraphRenderingParameters_setMinSizeOfLabels', null, ['number', 'number']);
    var _GlGraphRenderingParameters_minSizeOfLabels = Module.cwrap('GlGraphRenderingParameters_minSizeOfLabels', 'number', ['number']);
    var _GlGraphRenderingParameters_setMaxSizeOfLabels = Module.cwrap('GlGraphRenderingParameters_setMaxSizeOfLabels', null, ['number', 'number']);
    var _GlGraphRenderingParameters_maxSizeOfLabels = Module.cwrap('GlGraphRenderingParameters_maxSizeOfLabels', 'number', ['number']);
    var _GlGraphRenderingParameters_setElementsOrdered = Module.cwrap('GlGraphRenderingParameters_setElementsOrdered', null, ['number', 'number']);
    var _GlGraphRenderingParameters_elementsOrdered = Module.cwrap('GlGraphRenderingParameters_elementsOrdered', 'number', ['number']);
    var _GlGraphRenderingParameters_setElementOrderedDescending = Module.cwrap('GlGraphRenderingParameters_setElementOrderedDescending', null, ['number', 'number']);
    var _GlGraphRenderingParameters_elementsOrderedDescending = Module.cwrap('GlGraphRenderingParameters_elementsOrderedDescending', 'number', ['number']);
    var _GlGraphRenderingParameters_setElementsOrderingProperty = Module.cwrap('GlGraphRenderingParameters_setElementsOrderingProperty', null, ['number', 'number']);
    var _GlGraphRenderingParameters_elementsOrderingProperty = Module.cwrap('GlGraphRenderingParameters_elementsOrderingProperty', 'number', ['number']);

    tulip.GlGraphRenderingParameters = function tulip_GlGraphRenderingParameters(cppPointer) {
      var newObject = createObject(tulip.GlGraphRenderingParameters, this);
      tulip.CppObjectWrapper.call(newObject, cppPointer, 'GlGraphRenderingParameters');
      return newObject;
    };
    tulip.GlGraphRenderingParameters.inheritsFrom(tulip.CppObjectWrapper);

    tulip.GlGraphRenderingParameters.prototype.setDisplayNodes = function tulip_GlGraphRenderingParameters_prototype_setDisplayNodes(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setDisplayNodes(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.displayNodes = function tulip_GlGraphRenderingParameters_prototype_displayNodes() {
      return _GlGraphRenderingParameters_displayNodes(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setBillboardedNodes = function tulip_GlGraphRenderingParameters_prototype_setBillboardedNodes(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setBillboardedNodes(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.billboardedNodes = function tulip_GlGraphRenderingParameters_prototype_billboardedNodes() {
      return _GlGraphRenderingParameters_billboardedNodes(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setDisplayNodesLabels = function tulip_GlGraphRenderingParameters_prototype_setDisplayNodesLabels(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setDisplayNodesLabels(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.displayNodesLabels = function tulip_GlGraphRenderingParameters_prototype_displayNodesLabels() {
      return _GlGraphRenderingParameters_displayNodesLabels(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setLabelsScaled = function tulip_GlGraphRenderingParameters_prototype_setLabelsScaled(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setLabelsScaled(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.labelsScaled = function tulip_GlGraphRenderingParameters_prototype_labelsScaled() {
      return _GlGraphRenderingParameters_labelsScaled(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setDisplayEdges = function tulip_GlGraphRenderingParameters_prototype_setDisplayEdges(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setDisplayEdges(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.displayEdges = function tulip_GlGraphRenderingParameters_prototype_displayEdges() {
      return _GlGraphRenderingParameters_displayEdges(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setInterpolateEdgesColors = function tulip_GlGraphRenderingParameters_prototype_setInterpolateEdgesColors(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setInterpolateEdgesColors(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.interpolateEdgesColors = function tulip_GlGraphRenderingParameters_prototype_interpolateEdgesColors() {
      return _GlGraphRenderingParameters_interpolateEdgesColors(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setInterpolateEdgesSizes = function tulip_GlGraphRenderingParameters_prototype_setInterpolateEdgesSizes(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setInterpolateEdgesSizes(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.interpolateEdgesSizes = function tulip_GlGraphRenderingParameters_prototype_interpolateEdgesSizes() {
      return _GlGraphRenderingParameters_interpolateEdgesSizes(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setDisplayEdgesExtremities = function tulip_GlGraphRenderingParameters_prototype_setDisplayEdgesExtremities(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setDisplayEdgesExtremities(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.displayEdgesExtremities = function tulip_GlGraphRenderingParameters_prototype_displayEdgesExtremities() {
      return _GlGraphRenderingParameters_displayEdgesExtremities(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setEdges3D = function tulip_GlGraphRenderingParameters_prototype_setEdges3D(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setEdges3D(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.edges3D = function tulip_GlGraphRenderingParameters_prototype_edges3D() {
      return _GlGraphRenderingParameters_edges3D(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setMinSizeOfLabels = function tulip_GlGraphRenderingParameters_prototype_setMinSizeOfLabels(minSize) {
      checkArgumentsTypes(arguments, ['number'], 1);
      _GlGraphRenderingParameters_setMinSizeOfLabels(this.cppPointer, minSize);
    };

    tulip.GlGraphRenderingParameters.prototype.minSizeOfLabels = function tulip_GlGraphRenderingParameters_prototype_minSizeOfLabels() {
      return _GlGraphRenderingParameters_minSizeOfLabels(this.cppPointer);
    };

    tulip.GlGraphRenderingParameters.prototype.setMaxSizeOfLabels = function tulip_GlGraphRenderingParameters_prototype_setMaxSizeOfLabels(maxSize) {
      checkArgumentsTypes(arguments, ['number'], 1);
      _GlGraphRenderingParameters_setMaxSizeOfLabels(this.cppPointer, maxSize);
    };

    tulip.GlGraphRenderingParameters.prototype.maxSizeOfLabels = function tulip_GlGraphRenderingParameters_prototype_maxSizeOfLabels() {
      return _GlGraphRenderingParameters_maxSizeOfLabels(this.cppPointer);
    };

    tulip.GlGraphRenderingParameters.prototype.setElementsOrdered = function tulip_GlGraphRenderingParameters_prototype_setElementsOrdered(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setElementsOrdered(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.elementsOrdered = function tulip_GlGraphRenderingParameters_prototype_elementsOrdered() {
      return _GlGraphRenderingParameters_elementsOrdered(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setElementsOrderedDescending = function tulip_GlGraphRenderingParameters_prototype_setElementsOrderedDescending(state) {
      checkArgumentsTypes(arguments, ['boolean'], 1);
      _GlGraphRenderingParameters_setElementOrderedDescending(this.cppPointer, state);
    };

    tulip.GlGraphRenderingParameters.prototype.elementsOrderedDescending = function tulip_GlGraphRenderingParameters_prototype_elementsOrderedDescending() {
      return _GlGraphRenderingParameters_elementsOrderedDescending(this.cppPointer) > 0;
    };

    tulip.GlGraphRenderingParameters.prototype.setElementsOrderingProperty = function tulip_GlGraphRenderingParameters_prototype_setElementsOrderingProperty(prop) {
      if (!prop) {
        _GlGraphRenderingParameters_setElementsOrderingProperty(this.cppPointer, 0);
      } else {
        checkArgumentsTypes(arguments, [[tulip.DoubleProperty, tulip.IntegerProperty]], 1);
        _GlGraphRenderingParameters_setElementsOrderingProperty(this.cppPointer, prop.cppPointer);
      }
    };

    // ==================================================================================================

    var _GlGraphInputData_getElementColor = Module.cwrap('GlGraphInputData_getElementColor', 'number', ['number']);
    var _GlGraphInputData_setElementColor = Module.cwrap('GlGraphInputData_setElementColor', null, ['number', 'number']);
    var _GlGraphInputData_getElementLabelColor = Module.cwrap('GlGraphInputData_getElementLabelColor', 'number', ['number']);
    var _GlGraphInputData_setElementLabelColor = Module.cwrap('GlGraphInputData_setElementLabelColor', null, ['number', 'number']);
    var _GlGraphInputData_getElementSize = Module.cwrap('GlGraphInputData_getElementSize', 'number', ['number']);
    var _GlGraphInputData_setElementSize = Module.cwrap('GlGraphInputData_setElementSize', null, ['number', 'number']);
    var _GlGraphInputData_getElementLabelPosition = Module.cwrap('GlGraphInputData_getElementLabelPosition', 'number', ['number']);
    var _GlGraphInputData_setElementLabelPosition = Module.cwrap('GlGraphInputData_setElementLabelPosition', null, ['number', 'number']);
    var _GlGraphInputData_getElementShape = Module.cwrap('GlGraphInputData_getElementShape', 'number', ['number']);
    var _GlGraphInputData_setElementShape = Module.cwrap('GlGraphInputData_setElementShape', null, ['number', 'number']);
    var _GlGraphInputData_getElementRotation = Module.cwrap('GlGraphInputData_getElementRotation', 'number', ['number']);
    var _GlGraphInputData_setElementRotation = Module.cwrap('GlGraphInputData_setElementRotation', null, ['number', 'number']);
    var _GlGraphInputData_getElementSelection = Module.cwrap('GlGraphInputData_getElementSelection', 'number', ['number']);
    var _GlGraphInputData_setElementSelection = Module.cwrap('GlGraphInputData_setElementSelection', null, ['number', 'number']);
    var _GlGraphInputData_getElementFont = Module.cwrap('GlGraphInputData_getElementFont', 'number', ['number']);
    var _GlGraphInputData_setElementFont = Module.cwrap('GlGraphInputData_setElementFont', null, ['number', 'number']);
    var _GlGraphInputData_getElementFontSize = Module.cwrap('GlGraphInputData_getElementFontSize', 'number', ['number']);
    var _GlGraphInputData_setElementFontSize = Module.cwrap('GlGraphInputData_setElementFontSize', null, ['number', 'number']);
    var _GlGraphInputData_getElementLabel = Module.cwrap('GlGraphInputData_getElementLabel', 'number', ['number']);
    var _GlGraphInputData_setElementLabel = Module.cwrap('GlGraphInputData_setElementLabel', null, ['number', 'number']);
    var _GlGraphInputData_getElementLayout = Module.cwrap('GlGraphInputData_getElementLayout', 'number', ['number']);
    var _GlGraphInputData_setElementLayout = Module.cwrap('GlGraphInputData_setElementLayout', null, ['number', 'number']);
    var _GlGraphInputData_getElementTexture = Module.cwrap('GlGraphInputData_getElementTexture', 'number', ['number']);
    var _GlGraphInputData_setElementTexture = Module.cwrap('GlGraphInputData_setElementTexture', null, ['number', 'number']);
    var _GlGraphInputData_getElementBorderColor = Module.cwrap('GlGraphInputData_getElementBorderColor', 'number', ['number']);
    var _GlGraphInputData_setElementBorderColor = Module.cwrap('GlGraphInputData_setElementBorderColor', null, ['number', 'number']);
    var _GlGraphInputData_getElementBorderWidth = Module.cwrap('GlGraphInputData_getElementBorderWidth', 'number', ['number']);
    var _GlGraphInputData_setElementBorderWidth = Module.cwrap('GlGraphInputData_setElementBorderWidth', null, ['number', 'number']);
    var _GlGraphInputData_getElementSrcAnchorShape = Module.cwrap('GlGraphInputData_getElementSrcAnchorShape', 'number', ['number']);
    var _GlGraphInputData_setElementSrcAnchorShape = Module.cwrap('GlGraphInputData_setElementSrcAnchorShape', null, ['number', 'number']);
    var _GlGraphInputData_getElementSrcAnchorSize = Module.cwrap('GlGraphInputData_getElementSrcAnchorSize', 'number', ['number']);
    var _GlGraphInputData_setElementSrcAnchorSize = Module.cwrap('GlGraphInputData_setElementSrcAnchorSize', null, ['number', 'number']);
    var _GlGraphInputData_getElementTgtAnchorShape = Module.cwrap('GlGraphInputData_getElementTgtAnchorShape', 'number', ['number']);
    var _GlGraphInputData_setElementTgtAnchorShape = Module.cwrap('GlGraphInputData_setElementTgtAnchorShape', null, ['number', 'number']);
    var _GlGraphInputData_getElementTgtAnchorSize = Module.cwrap('GlGraphInputData_getElementTgtAnchorSize', 'number', ['number']);
    var _GlGraphInputData_setElementTgtAnchorSize = Module.cwrap('GlGraphInputData_setElementTgtAnchorSize', null, ['number', 'number']);
    var _GlGraphInputData_getElementFontAwesomeIcon = Module.cwrap('GlGraphInputData_getElementFontAwesomeIcon', 'number', ['number']);
    var _GlGraphInputData_setElementFontAwesomeIcon = Module.cwrap('GlGraphInputData_setElementFontAwesomeIcon', null, ['number', 'number']);
    var _GlGraphInputData_getElementGlow = Module.cwrap('GlGraphInputData_getElementGlow', 'number', ['number']);
    var _GlGraphInputData_setElementGlow = Module.cwrap('GlGraphInputData_setElementGlow', null, ['number', 'number']);
    var _GlGraphInputData_getElementGlowColor = Module.cwrap('GlGraphInputData_getElementGlowColor', 'number', ['number']);
    var _GlGraphInputData_setElementGlowColor = Module.cwrap('GlGraphInputData_setElementGlowColor', null, ['number', 'number']);
    var _GlGraphInputData_reloadGraphProperties = Module.cwrap('GlGraphInputData_reloadGraphProperties', null, ['number', 'number']);

    tulip.GlGraphInputData = function tulip_GlGraphInputData(cppPointer) {
      var newObject = createObject(tulip.GlGraphInputData, this);
      tulip.CppObjectWrapper.call(newObject, cppPointer, 'GlGraphInputData');
      return newObject;
    };
    tulip.GlGraphInputData.inheritsFrom(tulip.CppObjectWrapper);

    tulip.GlGraphInputData.prototype.getElementColor = function tulip_GlGraphInputData_prototype_getElementColor() {
      return tulip.ColorProperty(_GlGraphInputData_getElementColor(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementColor = function tulip_GlGraphInputData_prototype_setElementColor(prop) {
      checkArgumentsTypes(arguments, [tulip.ColorProperty], 1);
      _GlGraphInputData_setElementColor(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementLabelColor = function tulip_GlGraphInputData_prototype_getElementLabelColor() {
      return tulip.ColorProperty(_GlGraphInputData_getElementLabelColor(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementLabelColor = function tulip_GlGraphInputData_prototype_setElementLabelColor(prop) {
      checkArgumentsTypes(arguments, [tulip.ColorProperty], 1);
      _GlGraphInputData_setElementLabelColor(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementSize = function tulip_GlGraphInputData_prototype_getElementSize() {
      return tulip.SizeProperty(_GlGraphInputData_getElementSize(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementSize = function tulip_GlGraphInputData_prototype_setElementSize(prop) {
      checkArgumentsTypes(arguments, [tulip.SizeProperty], 1);
      _GlGraphInputData_setElementSize(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementLabelPosition = function tulip_GlGraphInputData_prototype_getElementLabelPosition() {
      return tulip.IntegerProperty(_GlGraphInputData_getElementLabelPosition(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementLabelPosition = function tulip_GlGraphInputData_prototype_setElementLabelPosition(prop) {
      checkArgumentsTypes(arguments, [tulip.IntegerProperty], 1);
      _GlGraphInputData_setElementLabelPosition(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementShape = function tulip_GlGraphInputData_prototype_getElementShape() {
      return tulip.IntegerProperty(_GlGraphInputData_getElementShape(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementShape = function tulip_GlGraphInputData_prototype_setElementShape(prop) {
      checkArgumentsTypes(arguments, [tulip.IntegerProperty], 1);
      _GlGraphInputData_setElementShape(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementRotation = function tulip_GlGraphInputData_prototype_getElementRotation() {
      return tulip.DoubleProperty(_GlGraphInputData_getElementRotation(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementRotation = function tulip_GlGraphInputData_prototype_setElementRotation(prop) {
      checkArgumentsTypes(arguments, [tulip.DoubleProperty], 1);
      _GlGraphInputData_setElementRotation(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementSelection = function tulip_GlGraphInputData_prototype_getElementSelection() {
      return tulip.BooleanProperty(_GlGraphInputData_getElementSelection(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementSelection = function tulip_GlGraphInputData_prototype_setElementSelection(prop) {
      checkArgumentsTypes(arguments, [tulip.BooleanProperty], 1);
      _GlGraphInputData_setElementSelection(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementFont = function tulip_GlGraphInputData_prototype_getElementFont() {
      return tulip.StringProperty(_GlGraphInputData_getElementFont(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementFont = function tulip_GlGraphInputData_prototype_setElementFont(prop) {
      checkArgumentsTypes(arguments, [tulip.StringProperty], 1);
      _GlGraphInputData_setElementFont(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementFontSize = function tulip_GlGraphInputData_prototype_getElementFontSize() {
      return tulip.IntegerProperty(_GlGraphInputData_getElementFontSize(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementFontSize = function tulip_GlGraphInputData_prototype_setElementFontSize(prop) {
      checkArgumentsTypes(arguments, [tulip.IntegerProperty], 1);
      _GlGraphInputData_setElementFontSize(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementLabel = function tulip_GlGraphInputData_prototype_getElementLabel() {
      return tulip.StringProperty(_GlGraphInputData_getElementLabel(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementLabel = function tulip_GlGraphInputData_prototype_setElementLabel(prop) {
      checkArgumentsTypes(arguments, [tulip.StringProperty], 1);
      _GlGraphInputData_setElementLabel(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementLayout = function tulip_GlGraphInputData_prototype_getElementLayout() {
      return tulip.LayoutProperty(_GlGraphInputData_getElementLayout(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementLayout = function tulip_GlGraphInputData_prototype_setElementLayout(prop) {
      checkArgumentsTypes(arguments, [tulip.LayoutProperty], 1);
      _GlGraphInputData_setElementLayout(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementTexture = function tulip_GlGraphInputData_prototype_getElementTexture() {
      return tulip.StringProperty(_GlGraphInputData_getElementTexture(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementTexture = function tulip_GlGraphInputData_prototype_setElementTexture(prop) {
      checkArgumentsTypes(arguments, [tulip.StringProperty], 1);
      _GlGraphInputData_setElementTexture(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementBorderColor = function tulip_GlGraphInputData_prototype_getElementBorderColor() {
      return tulip.ColorProperty(_GlGraphInputData_getElementBorderColor(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementBorderColor = function tulip_GlGraphInputData_prototype_setElementBorderColor(prop) {
      checkArgumentsTypes(arguments, [tulip.ColorProperty], 1);
      _GlGraphInputData_setElementBorderColor(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementBorderWidth = function tulip_GlGraphInputData_prototype_getElementBorderWidth() {
      return tulip.DoubleProperty(_GlGraphInputData_getElementBorderWidth(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementBorderWidth = function tulip_GlGraphInputData_prototype_setElementBorderWidth(prop) {
      checkArgumentsTypes(arguments, [tulip.DoubleProperty], 1);
      _GlGraphInputData_setElementBorderWidth(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementSrcAnchorShape = function tulip_GlGraphInputData_prototype_getElementSrcAnchorShape() {
      return tulip.IntegerProperty(_GlGraphInputData_getElementSrcAnchorShape(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementSrcAnchorShape = function tulip_GlGraphInputData_prototype_setElementSrcAnchorShape(prop) {
      checkArgumentsTypes(arguments, [tulip.IntegerProperty], 1);
      _GlGraphInputData_setElementSrcAnchorShape(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementSrcAnchorSize = function tulip_GlGraphInputData_prototype_getElementSrcAnchorSize() {
      return tulip.SizeProperty(_GlGraphInputData_getElementSrcAnchorSize(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementSrcAnchorSize = function tulip_GlGraphInputData_prototype_setElementSrcAnchorSize(prop) {
      checkArgumentsTypes(arguments, [tulip.SizeProperty], 1);
      _GlGraphInputData_setElementSrcAnchorSize(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementTgtAnchorShape = function tulip_GlGraphInputData_prototype_getElementTgtAnchorShape() {
      return tulip.IntegerProperty(_GlGraphInputData_getElementTgtAnchorShape(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementTgtAnchorShape = function tulip_GlGraphInputData_prototype_setElementTgtAnchorShape(prop) {
      checkArgumentsTypes(arguments, [tulip.IntegerProperty], 1);
      _GlGraphInputData_setElementTgtAnchorShape(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementTgtAnchorSize = function tulip_GlGraphInputData_prototype_getElementTgtAnchorSize() {
      return tulip.SizeProperty(_GlGraphInputData_getElementTgtAnchorSize(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementTgtAnchorSize = function tulip_GlGraphInputData_prototype_setElementTgtAnchorSize(prop) {
      checkArgumentsTypes(arguments, [tulip.SizeProperty], 1);
      _GlGraphInputData_setElementTgtAnchorSize(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementFontAwesomeIcon = function tulip_GlGraphInputData_prototype_getElementFontAwesomeIcon() {
      return tulip.StringProperty(_GlGraphInputData_getElementFontAwesomeIcon(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementFontAwesomeIcon = function tulip_GlGraphInputData_prototype_setElementFontAwesomeIcon(prop) {
      checkArgumentsTypes(arguments, [tulip.StringProperty], 1);
      _GlGraphInputData_setElementFontAwesomeIcon(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementGlow = function tulip_GlGraphInputData_prototype_getElementGlow() {
      return tulip.BooleanProperty(_GlGraphInputData_getElementGlow(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementGlow = function tulip_GlGraphInputData_prototype_setElementGlow(prop) {
      checkArgumentsTypes(arguments, [tulip.BooleanProperty], 1);
      _GlGraphInputData_setElementGlow(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.getElementGlowColor = function tulip_GlGraphInputData_prototype_getElementGlowColor() {
      return tulip.ColorProperty(_GlGraphInputData_getElementGlowColor(this.cppPointer));
    };

    tulip.GlGraphInputData.prototype.setElementGlowColor = function tulip_GlGraphInputData_prototype_setElementGlowColor(prop) {
      checkArgumentsTypes(arguments, [tulip.ColorProperty], 1);
      _GlGraphInputData_setElementGlowColor(this.cppPointer, prop.cppPointer);
    };

    tulip.GlGraphInputData.prototype.reloadGraphProperties = function tulip_GlGraphInputData_prototype_reloadGraphProperties(reset) {
      checkArgumentsTypes(arguments, ['boolean'], 0);
      _GlGraphInputData_reloadGraphProperties(this.cppPointer, reset);
    };

    // ==================================================================================================

    var _Camera_getViewport = Module.cwrap('Camera_getViewport', null, ['number', 'number']);
    var _Camera_modelViewMatrix = Module.cwrap('Camera_modelViewMatrix', null, ['number', 'number']);
    var _Camera_projectionMatrix = Module.cwrap('Camera_projectionMatrix', null, ['number', 'number']);
    var _Camera_setModelViewMatrix = Module.cwrap('Camera_setModelViewMatrix', null, ['number', 'number']);
    var _Camera_setProjectionMatrix = Module.cwrap('Camera_setProjectionMatrix', null, ['number', 'number']);

    tulip.Camera = function tulip_Camera(cppPointer) {
      var newObject = createObject(tulip.Camera, this);
      tulip.CppObjectWrapper.call(newObject, cppPointer, 'Camera');
      return newObject;
    };
    tulip.Camera.inheritsFrom(tulip.CppObjectWrapper);

    tulip.Camera.prototype.getViewport = function tulip_Camera_prototype_getViewport() {
      var intBuffer = allocArrayInEmHeap(Int32Array, 4);
      _Camera_getViewport(this.cppPointer, intBuffer.byteOffset);
      var ret = Array.prototype.slice.call(intBuffer).map(Number);
      freeArrayInEmHeap(intBuffer);
      return ret;
    };

    tulip.Camera.prototype.modelViewMatrix = function tulip_Camera_prototype_modelViewMatrix() {
      var floatBuffer = allocArrayInEmHeap(Float32Array, 16);
      _Camera_modelViewMatrix(this.cppPointer, floatBuffer.byteOffset);
      var ret = Array.prototype.slice.call(floatBuffer).map(Number);
      freeArrayInEmHeap(floatBuffer);
      return ret;
    };

    tulip.Camera.prototype.setModelViewMatrix = function tulip_Camera_prototype_setModelViewMatrix(mdvMat) {
      checkArgumentsTypes(arguments, ['array']);
      checkArrayOfType(mdvMat, 'number', 0);
      if (mdvMat.length == 16) {
        var floatBuffer = allocArrayInEmHeap(Float32Array, 16);
        floatBuffer.set(mdvMat);
        _Camera_setModelViewMatrix(this.cppPointer, floatBuffer.byteOffset);
        freeArrayInEmHeap(floatBuffer);
      }
    };

    tulip.Camera.prototype.projectionMatrix = function tulip_Camera_prototype_projectionMatrix() {
      var floatBuffer = allocArrayInEmHeap(Float32Array, 16);
      _Camera_projectionMatrix(this.cppPointer, floatBuffer.byteOffset);
      var ret = Array.prototype.slice.call(floatBuffer).map(Number);
      freeArrayInEmHeap(floatBuffer);
      return ret;
    };

    tulip.Camera.prototype.setProjectionMatrix = function tulip_Camera_prototype_setProjectionMatrix(projMat) {
      checkArgumentsTypes(arguments, ['array']);
      checkArrayOfType(projMat, 'number', 0);
      if (projMat.length == 16) {
        var floatBuffer = allocArrayInEmHeap(Float32Array, 16);
        floatBuffer.set(projMat);
        _Camera_setProjectionMatrix(this.cppPointer, floatBuffer.byteOffset);
        freeArrayInEmHeap(floatBuffer);
      }
    };

    // ==================================================================================================

    tulip.Graph.prototype.getTlpFileBlob = function(gzip) {
      var filename = '/graph.tlp';
      if (gzip) {
        filename += '.gz';
      }
      tulip.saveGraph(this, filename);
      var graphData = FS.readFile(filename);
      FS.unlink(filename);
      return new Blob([graphData.buffer]);
    };

  }

  // ==================================================================================================================


  tulip.isLoaded = function() {
    return tulip.mainCalled;
  };

  if (!nodejs) {

    tulip.Graph.prototype.applyAlgorithmInWorker = function(algorithmName, algoParameters, algoFinishedCallback) {
      if (!tulip.algorithmExists(algorithmName)) {
        console.log('Error : no Tulip algorithm named \'' + algorithmName + '\'');
        return;
      }
      if (algoParameters === undefined) {
        algoParameters = {};
      }
      var graphHierarchyId = this.getRoot().getCppPointer();
      if (tulip.vizFeatures && graphHierarchyId in graphHierarchyIdToView) {
        var view = graphHierarchyIdToView[graphHierarchyId];
        view.setGraphRenderingDataReady(false);
        view.startBusyAnimation();
        view.setProgressBarComment('Applying ' + algorithmName + ' algorithm ...');
      }
      var graph = this;
      sendGraphToWorker(this.getRoot()).then(function(tulipWorker) {
        var messageData = {
          graphHierarchyId : graphHierarchyId,
          graphId : graph.getId(),
          eventType: 'algorithm',
          algorithmName : algorithmName,
          parameters : JSON.stringify(algoParameters)
        };
        if (algoFinishedCallback) {
          algorithmFinishedCallbacks[graphHierarchyId] = algoFinishedCallback;
        }
        tulipWorker.postMessage(messageData);
      });
    };

    function applyPropertyAlgorithmInWorker(graph, algorithmName, resultProperty, algoParameters, algoFinishedCallback) {
      if (algoParameters === undefined) {
        algoParameters = {};
      }
      var graphHierarchyId = graph.getRoot().getCppPointer();
      sendGraphToWorker(graph.getRoot()).then(function(tulipWorker) {
        var messageData = {
          graphHierarchyId : graphHierarchyId,
          graphId : graph.getId(),
          eventType: 'propertyAlgorithm',
          algorithmName : algorithmName,
          resultPropertyName : resultProperty.getName(),
          parameters : JSON.stringify(algoParameters)
        };
        if (algoFinishedCallback) {
          algorithmFinishedCallbacks[graphHierarchyId] = algoFinishedCallback;
        }
        tulipWorker.postMessage(messageData);
        if (tulip.vizFeatures && graphHierarchyId in graphHierarchyIdToView) {
          var view = graphHierarchyIdToView[graphHierarchyId];
          view.setGraphRenderingDataReady(false);
          view.startBusyAnimation();
          view.setProgressBarComment('Applying ' + algorithmName + ' ' + resultProperty.getTypename() + ' algorithm ...');
        }
      });
    }

    tulip.Graph.prototype.applyDoubleAlgorithmInWorker = function(algorithmName, resultProperty, algoParameters, algoFinishedCallback) {
      if (!tulip.doubleAlgorithmExists(algorithmName)) {
        console.log('Error : no Tulip double algorithm named \'' + algorithmName + '\'');
        return;
      }
      if (resultProperty instanceof tulip.DoubleProperty) {
        applyPropertyAlgorithmInWorker(this, algorithmName, resultProperty, algoParameters, algoFinishedCallback);
      } else {
        console.log('Error : Second parameter of tulip.Graph.applyDoubleAlgorithm method must be an instance of tulip.DoubleProperty type.');
      }
    };

    tulip.Graph.prototype.applyLayoutAlgorithmInWorker = function(algorithmName, resultProperty, algoParameters, algoFinishedCallback) {
      if (!tulip.layoutAlgorithmExists(algorithmName)) {
        console.log('Error : no Tulip layout algorithm named \'' + algorithmName + '\'');
        return;
      }
      if (resultProperty instanceof tulip.LayoutProperty) {
        applyPropertyAlgorithmInWorker(this, algorithmName, resultProperty, algoParameters, algoFinishedCallback);
      } else {
        console.log('Error : Second parameter of tulip.Graph.applyLayoutAlgorithm method must be an instance of tulip.LayoutProperty type.');
      }
    };

    tulip.Graph.prototype.applySizeAlgorithmInWorker = function(algorithmName, resultProperty, algoParameters, algoFinishedCallback) {
      if (!tulip.sizeAlgorithmExists(algorithmName)) {
        console.log('Error : no Tulip size algorithm named \'' + algorithmName + '\'');
        return;
      }
      if (resultProperty instanceof tulip.SizeProperty) {
        applyPropertyAlgorithmInWorker(this, algorithmName, resultProperty, algoParameters, algoFinishedCallback);
      } else {
        console.log('Error : Second parameter of tulip.Graph.applySizeAlgorithm method must be an instance of tulip.SizeProperty type.');
      }
    };

    tulip.Graph.prototype.executeScriptInWorker = function(graphFunction, scriptExecutedCallback, scriptParameters) {
      var graph = this;
      var graphHierarchyId = this.getRoot().getCppPointer();
      sendGraphToWorker(this.getRoot()).then(function(tulipWorker) {
        if (scriptExecutedCallback) {
          algorithmFinishedCallbacks[graphHierarchyId] = scriptExecutedCallback;
        }
        if (tulip.vizFeatures && graphHierarchyId in graphHierarchyIdToView) {
          var view = graphHierarchyIdToView[graphHierarchyId];
          view.setGraphRenderingDataReady(false);
          view.startBusyAnimation();
          view.setProgressBarComment('Executing script on graph ...');
        }
        tulipWorker.postMessage({
          graphHierarchyId: graphHierarchyId,
          graphId : graph.getId(),
          eventType: 'executeGraphScript',
          scriptCode: graphFunction.toString(),
          scriptParameters: scriptParameters
        });
      });
    };

  }

  // ==================================================================================================================
}


  return tulipjs;
};

  if(typeof tulip == 'undefined') tulip = {};
  if(typeof tulipConf == 'undefined') tulipConf = {};
  this.tulip = tulip;
  var scriptName = getScriptName();
  var scriptPath = getScriptPath();
  if(tulipConf.modulePrefixURL) tulip.modulePrefixURL = tulipConf.modulePrefixURL;
  if(tulipConf.filePackagePrefixURL) tulip.filePackagePrefixURL = tulipConf.filePackagePrefixURL;
  if(tulipConf.memoryInitializerPrefixURL) tulip.memoryInitializerPrefixURL = tulipConf.memoryInitializerPrefixURL;
  if(tulipConf.TOTAL_MEMORY) tulip.TOTAL_MEMORY = tulipConf.TOTAL_MEMORY;
  if(!tulip.modulePrefixURL) tulip.modulePrefixURL = scriptPath;
  if(!tulip.filePackagePrefixURL) tulip.filePackagePrefixURL = scriptPath;
  if(!tulip.memoryInitializerPrefixURL) tulip.memoryInitializerPrefixURL = scriptPath;
  tulip.wasm = false;
  tulip.vizFeatures = false;
  tulip.isLoaded = function() {return false;};

  tulip.vizFeatures = true;

  tulip.wasm = true;

  var tulipInit = false;
  var tulipInitError = null;
  tulip.init = function() {
    return new Promise(function(resolve, reject) {
      if (!tulipInit) {
        tulipInit = true;
        if (!tulip.wasm) {
          try {
            tulip = tulipjs(tulip);
          } catch (e) {
            tulipInitError = e;
            reject(e);
          }
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', tulip.modulePrefixURL + 'tulip.wasm');
          xhr.responseType = 'arraybuffer';
          xhr.onload = function() {
            tulip.wasmBinary = xhr.response;
            try {
              tulip = tulipjs(tulip);
            } catch (e) {
              tulipInitError = e;
              reject(e);
            }
          };
          xhr.send(null);
        }
      }
      function checkTulipIsLoaded() {
        if (tulipInitError) {
          reject(tulipInitError);
        } else if (tulip.isLoaded()) {
          resolve();
        } else {
          setTimeout(checkTulipIsLoaded);
        }
      }
      checkTulipIsLoaded();
    });
  };

  if (typeof define === 'function' && define.amd) define(tulip); else if (typeof module === 'object' && module.exports) module.exports = tulip;

}();