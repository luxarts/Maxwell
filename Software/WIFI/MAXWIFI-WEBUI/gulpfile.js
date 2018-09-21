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
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest('dist/css/'));
}
//Limpia y reduce los HTML
function minifyHTML(){
	return gulp.src(path+'dist/*.html')
		.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, removeComments: true}))
		.pipe(gulp.dest('dist/'));
}
//Incluye el CSS y el JS en el HTML
function smoosh(){
	return gulp.src('dist/*.html')
		.pipe(smoosher())
		.pipe(gulp.dest('dist/'));
}
function copyICO(){
	return gulp.src(path+'/*.ico')
		.pipe(gulp.dest('dist/'));
}

//Copia los HTML en la carpeta
function copyHTML(){
	return gulp.src(path+'/*.html')
		.pipe(gulp.dest('dist/'));
}
function copyFonts(){
	return gulp.src(path+'fonts/*.*')
		.pipe(gulp.dest('dist/fonts/'));
}
function copyMWIcons(){
	return gulp.src(path+'/fonts/mwicons.css')
		.pipe(cleanCSS({debug: true}, function(details){
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest('dist/fonts/'));
}

function delCSS(){
	return del(['dist/css/*.css']);
}
function delJS(){
	return del(['dist/js/*.js']);
}
function delHTML(){
	return del(['dist/*.html']);
}
function delICO(){
	return del(['dist/*.ico']);
}

function compress(){
	return gulp.src('dist/*.*')
		.pipe(gzip())
		.pipe(gulp.dest('dist/'));
}

//var withsmoosh = gulp.series(clean, minifyJS, minifyCSS, smoosh, minifyHTML, delCSS, delJS, copyICO, compress, delHTML, delICO);
var withoutsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, minifyHTML, copyICO, compress, delCSS, delJS, delHTML, delICO);

var withsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, copyFonts, copyMWIcons, smoosh, minifyHTML, delCSS, delJS, compress, delHTML);

gulp.task('nosmoosh', withoutsmoosh);
gulp.task('smoosh', withsmoosh);


