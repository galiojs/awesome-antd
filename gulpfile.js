const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const merge2 = require('merge2');
const rimraf = require('rimraf');

const tsProject = ts.createProject('tsconfig.json');

async function clean() {
  return new Promise((resolve, reject) => {
    rimraf('es', (errors) => {
      if (errors) {
        reject(errors);
      }
      resolve();
    });
  });
}

function js() {
  const tsResult = gulp
    .src(['src/**/*.tsx', '!src/**/__test__/*.test.tsx', '!src/stories/**/*'])
    .pipe(tsProject());

  return merge2([
    tsResult.dts.pipe(gulp.dest('es')),
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
      .pipe(gulp.dest('es')),
  ]);
}

exports.compile = gulp.series(clean, js);
