const {src, dest, series} = require('gulp')
const watch = require('glob-watcher')
const webpack = require('webpack-stream')
const browserSync = require('browser-sync').create();
const nodemon = require('gulp-nodemon');
const del = require('del')
const named = require('vinyl-named')

function clean(){
    return del([
        './dist/scripts/**'
    ])
}

async function bsTask(){
    console.log('this is bs');
    return browserSync.init({
        proxy: "localhost:3000", 
        port: 3001
    })
}
async function nodemonTask(cb) {
        return nodemon( {
            script: '../bin/www', 
            ext: 'js html', 
            env: { 'NODE_ENV': 'development' }, 
            port: 3000, 
            done: cb()
        })//.once('start', cb);

};


function styles(){
    return src('../src/styles/**/*.css')
            .pipe(dest('dist/styles/'));
}
function games(){
    return src(['../src/scripts/comet.js',
                '../src/scripts/brawlbots/brawlbots.js'
               ])
            .pipe(named())
            .pipe(webpack({
                mode: 'development'
            }))
            // .pipe(rename('comet.js'))
            .pipe(dest('dist/scripts/'));
}

const dev = series(clean, games, styles)

async function watcher(){
    watch( [ `../src/**/**/**`, `../views/**/*.pug`], ()=>{
        series(
            dev(),
            browserSync.reload() )

    });
}

// const run = series(nodemonTask, bsTask, watcher);

const run = series(dev, watcher, nodemonTask, bsTask);
// async function run(){ return series(nodemonTask, bsTask, watcher) }
// const run = parallel(bsTask, nodemonTask);
// const run = () => {nodemonTask(bsTask)}//series(bsTask, nodemonTask);

module.exports = {dev, watcher, run}