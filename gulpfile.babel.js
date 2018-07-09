require('events').EventEmitter.prototype._maxListeners = 100;
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    replace = require('gulp-replace'),
    babel = require('gulp-babel'),
    stripDebug = require('gulp-strip-debug'),
    include = require('gulp-include'),
    flatten = require('gulp-flatten'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-cssnano'),
    util = require('gulp-util'),
    minifyHtml = require('gulp-htmlmin'),
    imageMin = require('gulp-imagemin'),
    zip = require('gulp-zip'),
    ignore = require('gulp-ignore'),
    jeditor = require('gulp-json-editor'),
    adwords = require('gulp-adwords'),
    imageSize = require('image-size'),
    fs = require('fs'),
    symbols = require('log-symbols'),
    through = require('through2'),
    del = require('del'),
    path = require('path'),
    uuid = require('node-uuid'),
    mergeStream = require('merge-stream'),
    argv = require('yargs').argv;

var config = require('./app/config.json');
var id =
    config.agency.replace(/\s/, '').toLowerCase() +
    '-' +
    uuid
        .v4()
        .replace(/-/g, '')
        .substr(0, 8);

var directories = {
    rich: {
        assets: 'app/rich/assets',
        templates: 'app/rich/templates',
        overview: 'app/rich/overview',
        temp: 'build/temp/rich'
    },
    static: {
        assets: 'app/static',
        temp: 'build/temp/static'
    },
    package: 'build/package'
};

/* Start default workflow */
gulp.task('default', ['static'], function() {
    gulp.watch('app/**/*', ['static']);
});

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('compile', ['clean'], function() {
    var tasks = [];
    delete require.cache[require.resolve('./app/config.json')];
    var config = require('./app/config.json');
    var hasRevisions = 'revisions' in config && config.revisions.length;

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size + '-' + clicktag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];

                if (hasRevisions) {
                    for (var u in config.revisions) {
                        var revision = config.revisions[u];
                        work(
                            clicktag,
                            size,
                            language,
                            folderName,
                            width,
                            height,
                            revision
                        );
                    }
                } else {
                    work(clicktag, size, language, folderName, width, height);
                }
            }
        }
    }

    function work(
        clicktag,
        size,
        language,
        folderName,
        width,
        height,
        revision
    ) {
        var basePath = directories.rich.templates + '/css';
        var srcArr = [clicktag, language, size];
        if (!!revision) srcArr.push(revision);

        var src = generateSrcFolders(basePath, ['**'], srcArr, ['css']);
        tasks.push(
            gulp
                .src(src, {base: basePath})
                .pipe(replace('{width}', width))
                .pipe(replace('{height}', height))
                .pipe(replace('{namespace}', id))
                .pipe(replace('{clicktag}', clicktag))
                .pipe(replace('{language}', language))
                .pipe(
                    replace('{revision}', function(str) {
                        return !!revision ? revision : '';
                    })
                )
                .pipe(sass())
                .pipe(gulp.dest(directories.rich.temp + '/css'))
                .pipe(minifyCss())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest(directories.rich.temp + '/css'))
        );

        basePath = directories.rich.templates + '/html';
        src = generateSrcFolders(basePath, ['**'], srcArr, ['html']);
        var html = gulp
            .src(src, {base: basePath})
            .pipe(replace('{width}', width))
            .pipe(replace('{height}', height))
            .pipe(replace('{language}', language))
            .pipe(replace('{clicktag}', clicktag))
            .pipe(
                replace('{revision}', function(str) {
                    return !!revision ? revision : '';
                })
            );
        for (var z in config.text[k]) {
            if (
                z == 'namespace' ||
                z == 'size' ||
                z == 'clicktag' ||
                z == 'url' ||
                z == 'width' ||
                z == 'height' ||
                z == 'language' ||
                z == 'revision'
            ) {
                throw new Error(
                    'when binding text, ' + z + ' is a reserved bind keyword.'
                );
            }
            html.pipe(replace('{' + z + '}', config.text[k][z]));
        }
        html.pipe(gulp.dest(directories.rich.temp + '/html'))
            .pipe(minifyHtml())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(directories.rich.temp + '/html'));

        tasks.push(html);

        basePath = directories.rich.templates + '/js';
        src = generateSrcFolders(basePath, ['**'], srcArr, ['js']);
        src.push(basePath + '/includes/**/*.js');
        tasks.push(
            gulp
                .src(src, {base: basePath})
                .pipe(replace('{width}', width))
                .pipe(replace('{height}', height))
                .pipe(replace('{size}', size))
                .pipe(replace('{language}', language))
                .pipe(replace('{clicktag}', clicktag))
                .pipe(
                    replace('{revision}', function(str) {
                        return !!revision ? revision : '';
                    })
                )
                .pipe(
                    babel({
                        presets: ['@babel/env']
                    })
                )
                .pipe(gulp.dest(directories.rich.temp + '/js'))
                .pipe(uglify({mangle: false}))
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest(directories.rich.temp + '/js'))
                .on('error', function(error) {
                    console.error(error);
                })
        );
    }
    return mergeStream(tasks);
});

gulp.task('generateHtml', ['compile'], function() {
    var overviewData = [];
    var bannerDataKeys = [];
    var overview = gulp.src(directories.rich.overview + '/index.html');
    var tasks = [];
    var config = require('./app/config.json');
    var hasRevisions = 'revisions' in config && config.revisions.length;

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var folderName = size + '-' + clicktag;
                var width = size.split('x')[0];
                var height = size.split('x')[1];
                var basePath = directories.rich.assets;

                if (hasRevisions) {
                    for (var u in config.revisions) {
                        var revision = config.revisions[u];
                        work(
                            clicktag,
                            size,
                            language,
                            folderName,
                            width,
                            height,
                            basePath,
                            revision
                        );
                    }
                } else {
                    work(
                        clicktag,
                        size,
                        language,
                        folderName,
                        width,
                        height,
                        basePath
                    );
                }
            }
        }
    }

    function work(
        clicktag,
        size,
        language,
        folderName,
        width,
        height,
        basePath,
        revision
    ) {
        var srcArr = [language, size, clicktag];
        if (!!revision) {
            srcArr.push(revision);
            folderName = folderName + '-' + revision;
        }
        var src = generateSrcFolders(basePath, [], srcArr, [
            'jpg',
            'png',
            'jpeg',
            'gif',
            'svg'
        ]);

        tasks.push(
            gulp
                .src(src, {base: basePath})
                .pipe(flatten())
                .pipe(gulp.dest('build/' + folderName + '/' + language))
        );

        //normal
        var index = gulp
            .src(directories.rich.templates + '/index.html')
            .pipe(replace('{namespace}', id))
            .pipe(replace('{size}', size))
            .pipe(replace('{clicktag}', clicktag))
            .pipe(replace('{size}', size))
            .pipe(replace('{width}', width))
            .pipe(replace('{height}', height))
            .pipe(
                replace('{revision}', function(str) {
                    return !!revision ? revision : '';
                })
            )
            .pipe(replace('{language}', language));

        for (var z in config.text[k]) {
            if (
                z == 'namespace' ||
                z == 'size' ||
                z == 'clicktag' ||
                z == 'url' ||
                z == 'width' ||
                z == 'height' ||
                z == 'language' ||
                z == 'revision'
            ) {
                throw new Error(
                    'when binding text, ' + z + ' is a reserved bind keyword.'
                );
            }
            index.pipe(replace('{' + z + '}', config.text[k][z]));
        }

        index
            .pipe(
                replace(
                    /(\/\/=include |\/\*=include |<!--=include )/g,
                    '$1../../../' + directories.rich.temp + '/'
                )
            )
            .pipe(include())
            .pipe(rename({suffix: '.fat'}))
            .pipe(gulp.dest('build/' + folderName + '/' + language));

        tasks.push(index);

        //minified
        var indexMin = gulp
            .src(directories.rich.templates + '/index.html')
            .pipe(replace('{namespace}', id))
            .pipe(replace('{size}', size))
            .pipe(
                replace(
                    /(\/\/=.*|<!--=.*|\/\*=.*)(\.js|\.html|\.css)/g,
                    '$1.min$2'
                )
            )
            .pipe(replace('{clicktag}', clicktag))
            .pipe(replace('{size}', size))
            .pipe(replace('{width}', width))
            .pipe(replace('{height}', height))
            .pipe(
                replace('{revision}', function(str) {
                    return !!revision ? revision : '';
                })
            )
            .pipe(replace('{language}', language));

        for (var z in config.text[k]) {
            indexMin.pipe(replace('{' + z + '}', config.text[k][z]));
        }

        indexMin
            .pipe(
                replace(
                    /(\/\/=include |\/\*=include |<!--=include )/g,
                    '$1../../../' + directories.rich.temp + '/'
                )
            )
            .pipe(include())
            .pipe(minifyHtml())
            .pipe(gulp.dest('build/' + folderName + '/' + language));

        tasks.push(indexMin);

        var bannerData = {
            width: width,
            height: height,
            src: '../' + folderName + '/' + language,
            language: language,
            folderName: folderName,
            size: size,
            version: config.version[language],
            clicktag: clicktag
        };
        if (!!revision) bannerData.revision = revision;

        var srcArr = [size, language, width, height, clicktag];
        if (!!revision) srcArr.push(revision);
        var key = bannerData.size + bannerData.language;
        if (
            !shouldExcludeBanner(config, srcArr) &&
            bannerDataKeys.indexOf(key) === -1
        ) {
            overviewData.push(bannerData);
            bannerDataKeys.push(key);
        } else util.log(util.colors.yellow(`Excluding ${size} ${language} ${clicktag}`));
    }

    overview
        .pipe(replace('{ data }', 'var data = ' + JSON.stringify(overviewData)))
        .pipe(replace('{ config }', 'var config = ' + JSON.stringify(config)))
        .pipe(replace('{name}', config.name))
        .pipe(replace('{version}', config.version))
        .pipe(replace('{brand}', config.brand))
        .pipe(gulp.dest('build/overview'));

    tasks.push(overview);

    return mergeStream(tasks);
});

gulp.task('static', ['generateHtml'], function() {
    var tasks = [];
    var config = require('./app/config.json');

    for (var language in config.text) {
        tasks.push(
            gulp
                .src('app/static/' + language + '/**/*')
                .on('error', error => console.error(error))
                .pipe(gulp.dest(directories.static.temp + '/' + language))
        );
    }

    return mergeStream(tasks);
});
/* End default workflow */

/* Begin package workflow */
gulp.task('package', ['packageContinueTask']);
gulp.task('publish', ['packageContinueTask']);

gulp.task('cleanPackage', function() {
    return del(['build/package']);
});

gulp.task('validate', ['cleanPackage'], function() {
    var tasks = [];
    var config = require('./app/config.json');
    var hasRevisions = 'revisions' in config && config.revisions.length;

    var includeTest = {
        test: function(html, files) {
            var regex = html.match(/\/\/=include |\/\*=include |<!--=include/g);
            return {
                result: !(regex && Array.isArray(regex) && regex.length)
            };
        },
        message: 'Include syntax found.',
        name: 'TEMPLATE_INCLUDE_TEST'
    };

    var doubleclickClicktagTest = {
        test: function(html, files) {
            var regex = html.match(
                /var click(TAG|Tag)\s{0,1}=\s{0,1}('|").*('|")/g
            );
            return {
                result: regex && Array.isArray(regex) && regex.length
            };
        },
        message: 'Clicktag not found. Make sure it is defined.',
        name: 'CLICKTAG_TEST'
    };

    var adgearClicktagTest = {
        test: function(html, files) {
            var regex = html.match(
                /ADGEAR\.html5\.clickThrough\((\"|\')clickTag(\"|\')\)|window\.open\(window.clickTag\)/g
            );
            return {
                result: regex && Array.isArray(regex) && regex.length
            };
        },
        message: 'Clicktag not found. Make sure it is defined.',
        name: 'CLICKTAG_TEST'
    };

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;

                if (hasRevisions) {
                    for (var u in config.revisions) {
                        var revision = config.revisions[u];
                        work(clicktag, size, language, revision);
                    }
                } else {
                    work(clicktag, size, language);
                }
            }
        }
    }

    function work(clicktag, size, language, revision) {
        var srcArr = [clicktag, size, language];
        if (!!revision) srcArr.push(revision);
        if (shouldExcludeBanner(config, srcArr)) {
            util.log(
                util.colors.yellow(`Excluding ${size} ${language} ${clicktag}`)
            );
            return;
        }

        var customTests = [];
        if (clicktag == 'doubleclick')
            customTests.push(doubleclickClicktagTest);
        else if (clicktag == 'adgear') customTests.push(adgearClicktagTest);

        var baseName = size + '-' + clicktag;
        if (!!revision) baseName += '-' + revision;

        //validate rich banner
        tasks.push(
            gulp
                .src('build/' + baseName + '/' + language + '/**/*')
                .pipe(ignore.exclude(/index\.fat\.html/))
                .pipe(
                    adwords({
                        size:
                            size in config.filesize
                                ? config.filesize[size]
                                : config.filesize.rich,
                        environment: clicktag,
                        name:
                            size +
                            ' ' +
                            language +
                            ' ' +
                            clicktag +
                            ' ' +
                            revision,
                        customTests: customTests
                    })
                )
                .pipe(ignore.exclude(/\./))
                .pipe(gulp.dest('.'))
        );

        baseName = language;
        if (!!revision) baseName += '/' + revision;

        //validate static banner
        gulp.src(
            'build/temp/static/' + baseName + '/' + size + '.{jpg,jpeg,png,gif}'
        )
            .pipe(
                through.obj(function(file, enc, cb) {
                    var name = file.path.match(
                        /([0-9]{2,4}x[0-9]{2,4})\.[a-zA-Z]{1,10}$/g
                    )[0];
                    var requiredDimensions = name.match(/[0-9]*x[0-9]*/g)[0];
                    var dimensions = imageSize(file.path);
                    dimensions = dimensions.width + 'x' + dimensions.height;

                    var size = file.stat.size;
                    var requiredSize = config.filesize.static;

                    var errors = 0;
                    util.log(name);
                    //make sure the image dimensions match it's size
                    if (requiredDimensions !== dimensions) {
                        util.log(
                            util.colors.red.bold('WARNING: ') +
                                util.colors.cyan(name) +
                                ' dimensions do not match ' +
                                requiredDimensions +
                                ': ' +
                                util.colors.red(dimensions)
                        );
                        errors++;
                    }

                    //make sure the image size does not exceed the size specified in the config
                    if (size > requiredSize * 1000) {
                        util.log(
                            util.colors.red.bold('WARNING: ') +
                                util.colors.cyan(name) +
                                ' exceeds filesize limit of ' +
                                requiredSize +
                                ' KB: ' +
                                util.colors.red(size / 1000 + ' KB')
                        );
                        errors++;
                    }

                    if (errors) {
                        util.log(
                            util.colors.red.bold(`${symbols.error} FAILED`)
                        );
                    } else {
                        util.log(
                            util.colors.green.bold(`${symbols.success} PASSED`)
                        );
                    }
                    cb(null, file);
                })
            )
            .pipe(ignore.exclude(/\./))
            .pipe(gulp.dest('.'));
    }

    var noop = gulp
        .src('.')
        .pipe(ignore.exclude(/\./))
        .pipe(gulp.dest('.'));
    if (!tasks.length) tasks.push(noop);
    return mergeStream(tasks);
});

gulp.task('packageTask', ['validate'], function() {
    var tasks = [];
    var config = require('./app/config.json');
    var year = new Date().getFullYear();
    var month = config.month;
    var brand = config.brand;
    var version = config.version;
    var name = config.name;
    var agency = config.agency;
    var hasRevisions = 'revisions' in config && config.revisions.length;

    for (var i in config.sizes) {
        for (var k in config.text) {
            for (var j in config.clicktags) {
                var clicktag = config.clicktags[j];
                var size = config.sizes[i];
                var language = k;
                var v = version[language];

                if (hasRevisions) {
                    for (var u in config.revisions) {
                        var revision = config.revisions[u];
                        work(clicktag, size, v, language, revision);
                    }
                } else {
                    work(clicktag, size, v, language);
                }
            }
        }
    }

    function work(clicktag, size, v, language, revision) {
        var srcArr = [size, language, clicktag];
        if (!!revision) srcArr.push(revision);
        if (shouldExcludeBanner(config, srcArr)) {
            return;
        }

        var packageName = `${year}_${brand}Brand_${agency
            .split(' ')
            .reduce(
                (a, value) => a + value[0].toUpperCase(),
                ''
            )}_Other_${name}_${month}_HTML5_CA_${language.toUpperCase()}_V${v}${
            !!revision ? revision : ''
        }_${size}`;

        var srcPath = 'build/' + size + '-' + clicktag;
        if (!!revision) {
            srcPath += '-' + revision;
        }
        srcPath += '/' + language + '/*';

        var destPath = 'build/package/' + clicktag + '/' + language;
        if (!!revision) destPath += '/' + revision;

        tasks.push(
            gulp
                .src(srcPath)
                .pipe(ignore(['index.fat.html']))
                .pipe(zip(packageName + '.zip'))
                .pipe(gulp.dest(destPath))
        );
    }

    return mergeStream(tasks);
});

gulp.task('packageStaticTask', ['packageTask'], function() {
    var tasks = [];
    var config = require('./app/config.json');
    var year = new Date().getFullYear();
    var month = config.month;
    var brand = config.brand;
    var agency = config.agency;
    var version = config.version;
    var name = config.name;
    var hasRevisions = 'revisions' in config && config.revisions.length;

    for (var h in config.sizes) {
        for (var j in config.clicktags) {
            for (var i in config.text) {
                var size = config.sizes[h];
                var clicktag = config.clicktags[j];
                var language = i;
                var v = version[language];
                var imageName = `${year}_${brand}Brand_${agency
                    .split(' ')
                    .reduce(
                        (a, value) => a + value[0].toUpperCase(),
                        ''
                    )}_Other_${name}_${month}_HTML5_CA_${language.toUpperCase()}`;

                if (hasRevisions) {
                    for (var u in config.revisions) {
                        var revision = config.revisions[u];
                        var suffix = `_V${v}${revision}_${size}`;
                        work(
                            clicktag,
                            size,
                            language,
                            imageName + suffix,
                            revision
                        );
                    }
                } else {
                    imageName += `_V${v}_${size}`;
                    work(clicktag, size, language, imageName);
                }
            }
        }
    }

    function work(clicktag, size, language, imageName, revision) {
        var srcArr = [size, language, clicktag];
        if (!!revision) srcArr.push(revision);
        if (shouldExcludeBanner(config, srcArr)) {
            return;
        }
        var destPath = directories.package + '/' + clicktag + '/' + language;
        if (!!revision) destPath += '/' + revision;

        var srcPath = directories.static.temp + '/' + language;
        if (!!revision) srcPath += '/' + revision;
        srcPath += '/' + size + '.*';

        tasks.push(
            gulp
                .src(srcPath)
                .pipe(rename({basename: imageName}))
                .pipe(gulp.dest(destPath))
        );
    }

    return mergeStream(tasks);
});

gulp.task('packageContinueTask', ['packageStaticTask'], function() {
    var tasks = [];
    var config = require('./app/config.json');
    var year = new Date().getFullYear();
    var month = config.month;
    var brand = config.brand;
    var version = config.version;
    var agency = config.agency;
    var name = config.name;
    // var language =
    var hasRevisions = 'revisions' in config && config.revisions.length;

    for (var j in config.clicktags) {
        for (var i in config.text) {
            var language = i;
            var clicktag = config.clicktags[j];
            var v = version[i];
            var n = `${year}_${brand}Brand_${agency
                .split(' ')
                .reduce(
                    (a, value) => a + value[0].toUpperCase(),
                    ''
                )}_Other_${name}_${month}_HTML5_CA_${clicktag}_${language.toUpperCase()}`;

            if (hasRevisions) {
                for (var u in config.revisions) {
                    var revision = config.revisions[u];
                    var suffix = `_V${v}${revision}`;
                    work(clicktag, n + suffix, language, revision);
                }
            } else {
                n += `_V${v}`;
                work(clicktag, n, language);
            }
        }
    }

    function work(clicktag, name, language, revision) {
        var basePath = directories.package + '/' + clicktag + '/' + language;
        if (!!revision) basePath += '/' + revision;
        tasks.push(
            gulp
                .src(basePath + '/**/*')
                .pipe(zip(name + '.zip'))
                .pipe(gulp.dest(directories.package))
        );
    }

    return mergeStream(tasks);
});
/* End package workflow */

/* Start version workflow */
gulp.task('version', function() {
    if (argv.reset) {
        gulp.src('./app/config.json')
            .pipe(jeditor({version: '1'}))
            .pipe(gulp.dest('./app'));
    } else {
        gulp.src('./app/config.json')
            .pipe(
                jeditor(function(json) {
                    json.version = String(Number(json.version) + 1);
                    return json;
                })
            )
            .pipe(gulp.dest('./app'));
    }
});
/* End version workflow */

/* Helper functions */
function generateSrcFolders(path, subfolders, params, extensions) {
    function allCombinationsOf(src, minLen, maxLen) {
        minLen = minLen - 1 || 0;
        maxLen = maxLen || src.length + 1;
        var Asource = src.slice(); // copy the original so we don't apply results to the original.

        var Aout = [];

        var minMax = function(arr) {
            var len = arr.length;
            if (len > minLen && len <= maxLen) {
                Aout.push(arr);
            }
        };

        var picker = function(arr, holder, collect) {
            if (holder.length) {
                collect.push(holder);
            }
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                var arrcopy = arr.slice();
                var elem = arrcopy.splice(i, 1);
                var result = holder.concat(elem);
                minMax(result);
                if (len) {
                    picker(arrcopy, result, collect);
                } else {
                    collect.push(result);
                }
            }
        };

        picker(Asource, [], []);

        return Aout;
    }

    var src = [];
    if (typeof params === 'string') params = [params];
    if (typeof extensions !== undefined) {
        var extension = '{';
        for (var i in extensions) {
            extension =
                i == extensions.length - 1
                    ? extension + extensions[i]
                    : extension + extensions[i] + ',';
        }
        extension += '}';
    }

    var permutations = allCombinationsOf(params, 1, 3);

    for (var i in permutations) {
        var path1 = '';
        for (var j in permutations[i]) {
            path1 =
                j == permutations[i].length - 1
                    ? path1 + permutations[i][j]
                    : path1 + permutations[i][j] + '/';
        }

        if (extensions !== undefined && extension.length) {
            src.push(path + '/' + path1 + '/*.' + extension);
        } else {
            src.push(path + '/' + path1 + '/*.*');
        }
        src.push(path + '/' + path1 + '.*');

        for (var h in subfolders) {
            if (extensions !== undefined && extension.length) {
                src.push(
                    path + '/' + subfolders[h] + '/' + path1 + '/*.' + extension
                );
            } else {
                src.push(path + '/' + subfolders[h] + '/' + path1 + '/*.*');
            }

            src.push(path + '/' + subfolders[h] + '/' + path1 + '.*');
        }
    }

    src.push(path + '/global.*');
    src.push(path + '/global/**/*');

    return src;
}

function shouldExcludeBanner(config, params) {
    for (var i in config.exclude) {
        var matched = 0;
        var exclusion =
            typeof config.exclude[i] === 'string'
                ? [config.exclude[i]]
                : config.exclude[i];

        for (var j in exclusion) {
            var val = exclusion[j];

            for (var h in params) {
                if (val == params[h]) {
                    if (++matched == exclusion.length) return true;
                    break;
                }
            }
        }
    }
    return false;
}
