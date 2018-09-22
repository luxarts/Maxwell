var gulp = require('gulp'),
	uglify = require('gulp-uglify-es').default,
	cleanCSS = require('gulp-clean-css'),
	merge = require('merge-stream'),
	del = require('del'),
	gzip = require('gulp-gzip'),
	htmlmin = require('gulp-htmlmin'),
	fs = require('fs'),
	smoosher = require('gulp-smoosher');

var path = "www/";

function clean(){
	return del(['dist']);
}
//Limpia y reduce los JS
function minifyJS(){
	return gulp.src(path+'js/*.js')
		.pipe(uglify({mangle: true}))
		.pipe(gulp.dest('dist/js/'));
}
//Limpia y reduce los CSS
function minifyCSS(){
	return gulp.src(path+'css/*.css')
		.pipe(cleanCSS({debug: true}, function(details){
			console.log(details.name + ': ' + details.stats.originalSize);
			console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest('dist/css/'));
}
function minifyIconCSS(){
	return gulp.src(path+'/fonts/mwicons.css')
		.pipe(cleanCSS({debug: true}, function(details){
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest('dist/fonts/'));
}
//Copia los HTML en la carpeta
function copyHTML(){
	return gulp.src(path+'/*.html')
		.pipe(gulp.dest('dist/'));
}
//Incluye el CSS y el JS en el HTML
function smoosh(){
	return gulp.src('dist/*.html')
		.pipe(smoosher())
		.pipe(gulp.dest('dist/'));
}
//Limpia y reduce los HTML
function minifyHTML(){
	return gulp.src(path+'dist/*.html')
		.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, removeComments: true}))
		.pipe(gulp.dest('dist/'));
}
function copyFonts(){
	return gulp.src(path+'fonts/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest('dist/'));
}
function delJS(){
	return del(['dist/js']);
}
function delCSS(){
	return del(['dist/css']);
}
function compress(){
	return gulp.src('dist/*.*')
		.pipe(gzip())
		.pipe(gulp.dest('dist/'));
}
function delHTML(){
	return del(['dist/*.html']);
}
function delFonts(){
	return del(['dist/*.{eot,svg,ttf,woff}']);
}
function delFontsFolder(){
	return del(['dist/fonts']);
}

var compressed = gulp.series(clean, minifyJS, minifyCSS, minifyIconCSS, copyHTML, smoosh, minifyHTML, copyFonts, delJS, delCSS, compress, delHTML, delFonts, delFontsFolder);
var notcompressed = gulp.series(clean, minifyJS, minifyCSS, minifyIconCSS, copyHTML, smoosh, minifyHTML, copyFonts, delJS, delCSS, delFontsFolder);


gulp.task('notcompressed', notcompressed);
gulp.task('compressed', compressed);


