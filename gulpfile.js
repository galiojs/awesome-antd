const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const less = require('gulp-less');
const merge2 = require('merge2');
const rimraf = require('rimraf');

const tsProject = ts.createProject('tsconfig.json');

const pathMap = {
  esOutput: 'es',
  jsSrc: ['src/**/*.tsx', '!src/**/__test__/*.test.tsx', '!src/stories/**/*'],
  cssSrc: 'src/**/style/*.less',
};

async function clean() {
  return new Promise((resolve, reject) => {
    rimraf(pathMap.esOutput, (errors) => {
      if (errors) {
        reject(errors);
      }
      resolve();
    });
  });
}

function js() {
  const tsResult = gulp.src(pathMap.jsSrc).pipe(tsProject());

  return merge2([
    tsResult.dts.pipe(gulp.dest(pathMap.esOutput)),
    tsResult.js
      .pipe(
        babel({
          presets: [
            [
              'react-app',
              {
                /*https://github.com/facebook/create-react-app/issues/7183#issuecomment-509975452*/
                absoluteRuntime: false,
              },
            ],
          ],
        })
      )
      .pipe(gulp.dest(pathMap.esOutput)),
  ]);
}

function css() {
  return gulp
    .src(pathMap.cssSrc)
    .pipe(less({ paths: [path.join(__dirname, 'node_modules', 'antd', 'lib', 'style')] }))
    .pipe(gulp.dest(pathMap.esOutput));
}

exports.compile = gulp.series(clean, js, css);
exports.watch = function () {
  gulp.watch(pathMap.jsSrc, js);
  gulp.watch(pathMap.cssSrc, css);
};
