const fs = require('fs')
const path = require('path')

function readdir(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if (err) {
                reject(err);
            }
            resolve(list);
        });
    });
}

function stat(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });
}

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
    return stat(filePath).then(stats => {
        if (stats.isDirectory()) {
            return readdir(filePath).then(list =>
                Promise.all(list.map(item =>
                    fileDisplay(path.resolve(filePath, item))
                ))
            ).then(subtree => [].concat(...subtree));
        } else {
            return [filePath];
        }
    });
}

module.exports = fileDisplay