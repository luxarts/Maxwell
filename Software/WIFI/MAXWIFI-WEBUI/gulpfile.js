var gulp = require('gulp'),
	uglify = require('gulp-uglify-es').default,
	cleanCSS = require('gulp-clean-css'),
	merge = require('merge-stream'),
	del = require('del'),
	gzip = require('gulp-gzip'),
	htmlmin = require('gulp-htmlmin'),
	fs = require('fs'),
	smoosher = require('gulp-smoosher'),
	replace = require('gulp-replace-path');

var path = "www/";

function clean(){
	return del(['data']);
}
//Limpia y reduce los JS
function minifyJS(){
	return gulp.src(path+'js/*.js')
		.pipe(uglify({mangle: true}))
		.pipe(gulp.dest('data/js/'));
}
//Limpia y reduce los CSS
function minifyCSS(){
	return gulp.src(path+'css/*.css')
		.pipe(cleanCSS({debug: true}, function(details){
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest('data/css/'));
}

function replacePathsHTML(){
	return gulp.src('data/*.html')
		.pipe(replace("css/materialize.css","materialize.css"))
		.pipe(replace("js/materialize.min.js","materialize.min.js"))
		.pipe(gulp.dest('data/'))
}
function replaceImg(){
	return gulp.src('data/*.html')
		.pipe(replace("img/",""))
		.pipe(gulp.dest('data/'));	
}

function replacePathsJS(){
	return gulp.src('data/js/*.js')
		.pipe(replace("js/gcodeProcessor.js","gcodeProcessor.js"))
		.pipe(gulp.dest('data/js/'))
}
//Limpia y reduce los HTML
function minifyHTML(){
	return gulp.src('data/*.html')
		.pipe(htmlmin({collapseWhitespace: true, minifyCSS: true, removeComments: true}))
		.pipe(gulp.dest('data/'));
}
function minifyIconCSS(){
	return gulp.src(path+'/fonts/mwicons.css')
		.pipe(cleanCSS({debug: true}, function(details){
			//console.log(details.name + ': ' + details.stats.originalSize);
			//console.log(details.name + ': ' + details.stats.minifiedSize);
		}))
		.pipe(gulp.dest('data/fonts/'));
}
//Incluye el CSS y el JS en el HTML
function smoosh(){
	return gulp.src('data/*.html')
		.pipe(smoosher())
		.pipe(gulp.dest('data/'));
}
//Copia los HTML en la carpeta
function copyHTML(){
	return gulp.src(path+'/*.html')
		.pipe(gulp.dest('data/'));
}
function delCSS(){
	return del(['data/css']);
}
function delJS(){
	return del(['data/js']);
}
function delWorkers(){
	return del(['data/*.js']);
}
function delHTML(){
	return del(['data/*.html']);
}
function copyFonts(){
	return gulp.src(path+'fonts/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest('data/'));
}
function copyMaterialize(){
	var matCSS = gulp.src('data/css/materialize.css')
				.pipe(gulp.dest('data/'));
	var matJS = gulp.src('data/js/materialize.min.js')
				.pipe(gulp.dest('data/'));
	return merge(matCSS, matJS);
}
function compress(){
	return gulp.src('data/*.*')
		.pipe(gzip())
		.pipe(gulp.dest('data/'));
}
function delFonts(){
	return del(['data/*.{eot,svg,ttf,woff}']);
}
function delFontsFolder(){
	return del(['data/fonts']);
}
function copyWorkers(){
	return gulp.src('data/js/gcodeProcessor.js')
			.pipe(gulp.dest('data/'));
}
function delUnused(){
	return del(['data/**/*','!data/**/*.gz']);
}
function copyImg(){
	return gulp.src(path+'/img/*.*')
		.pipe(gulp.dest('data/'));
}

var compressed = gulp.series(clean, minifyJS, replacePathsJS, minifyCSS, minifyIconCSS, copyHTML, replacePathsHTML, replaceImg, copyWorkers, smoosh, minifyHTML, copyFonts, copyImg, copyMaterialize, delJS, delCSS, compress, delUnused);
var notcompressed = gulp.series(clean, minifyJS, replacePathsJS, minifyCSS, minifyIconCSS, copyHTML, replacePathsHTML, replaceImg, copyWorkers, smoosh, copyFonts, copyImg, copyMaterialize, delFontsFolder);


gulp.task('notcompressed', notcompressed);
gulp.task('compressed', compressed);


