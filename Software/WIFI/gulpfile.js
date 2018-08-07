var gulp = require('gulp'),
	uglify = require('gulp-uglify-es').default,
	cleanCSS = require('gulp-clean-css'),
	merge = require('merge-stream'),
	del = require('del'),
	gzip = require('gulp-gzip'),
	htmlmin = require('gulp-htmlmin'),
	fs = require('fs'),
	smoosher = require('gulp-smoosher');

var path = "ESPWebSockets/";

function clean(){
	return del([path+'dist']);
}

//Limpia y reduce los JS
function minifyJS(){
	return gulp.src(path+'data/*.js')
		.pipe(uglify({mangle: true}))
		.pipe(gulp.dest(path+'dist/'));
}

//Limpia y reduce los CSS
function minifyCSS(){
	return gulp.src(path+'data/*.css')
		.pipe(cleanCSS({debug: true}, function(details){
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest(path+'dist/'));
}
//Limpia y reduce los HTML
function minifyHTML(){
	return gulp.src(path+'dist/*.html')
		.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true}))
		.pipe(gulp.dest(path+'dist/'));
}
//Incluye el CSS y el JS en el HTML
function smoosh(){
	return gulp.src(path+'dist/*.html')
		.pipe(smoosher())
		.pipe(gulp.dest(path+'dist'));
}
function copyICO(){
	return gulp.src(path+'data/*.ico')
		.pipe(gulp.dest(path+'dist'));
}

//Copia los HTML en la carpeta
function copyHTML(){
	return gulp.src(path+'data/*.html')
		.pipe(gulp.dest(path+'dist'));
}

function delCSS(){
	return del([path+'dist/*.css']);
}
function delJS(){
	return del([path+'dist/*.js']);
}
function delHTML(){
	return del([path+'dist/*.html']);
}
function delICO(){
	return del([path+'dist/*.ico']);
}

function compress(){
	return gulp.src(path+'dist/*.*')
		.pipe(gzip())
		.pipe(gulp.dest(path+'dist'));
}

var withsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, smoosh, minifyHTML, delCSS, delJS, copyICO, compress, delHTML, delICO);
var withoutsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, minifyHTML, copyICO, compress, delCSS, delJS, delHTML, delICO);
//gulp.task('clean', clean);
//gulp.task('minify', minify);
//gulp.task('lint', lint);
gulp.task('nosmoosh', withoutsmoosh);
gulp.task('smoosh', withsmoosh);
