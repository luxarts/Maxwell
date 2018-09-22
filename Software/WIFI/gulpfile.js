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
	return del([path+'data']);
}

//Limpia y reduce los JS
function minifyJS(){
	return gulp.src(path+'www/*.js')
		.pipe(uglify({mangle: true}))
		.pipe(gulp.dest(path+'data/'));
}

//Limpia y reduce los CSS
function minifyCSS(){
	return gulp.src(path+'www/*.css')
		.pipe(cleanCSS({debug: true}, function(details){
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest(path+'data/'));
}
//Limpia y reduce los HTML
function minifyHTML(){
	return gulp.src(path+'data/*.html')
		.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, removeComments: true}))
		.pipe(gulp.dest(path+'data/'));
}
//Incluye el CSS y el JS en el HTML
function smoosh(){
	return gulp.src(path+'data/*.html')
		.pipe(smoosher())
		.pipe(gulp.dest(path+'data/'));
}
function copyICO(){
	return gulp.src(path+'www/*.ico')
		.pipe(gulp.dest(path+'data'));
}
//Copia los HTML en la carpeta
function copyHTML(){
	return gulp.src(path+'www/*.html')
		.pipe(gulp.dest(path+'data/'));
}

function delCSS(){
	return del([path+'data/*.css']);
}
function delJS(){
	return del([path+'data/*.js', '!'+path+'data/gcodeProcessor.js']);
}
function delHTML(){
	return del([path+'data/*.html']);
}
function delICO(){
	return del([path+'data/*.ico']);
}

function compress(){
	return gulp.src(path+'data/*.*')
		.pipe(gzip())
		.pipe(gulp.dest(path+'data'));
}

//var withsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, smoosh, minifyHTML, delCSS, delJS);
var withsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, smoosh, minifyHTML, delCSS, delJS, copyICO, compress, delHTML, delICO);
var withoutsmoosh = gulp.series(clean, minifyJS, minifyCSS, copyHTML, minifyHTML, copyICO, compress, delCSS, delJS, delHTML, delICO);

gulp.task('nosmoosh', withoutsmoosh);
gulp.task('smoosh', withsmoosh);
