var gulp = require('gulp'),
	jshint = require('jshint'),
	gulpif = require('gulp-if'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es'),
	cleanCSS = require('gulp-clean-css'),
	removeCode = require('gulp-remove-code'),
	merge = require('merge-stream'),
	del = require('del'),
	zip = require('gulp-zip'),
	gzip = require('gulp-gzip'),
	htmlmin = require('gulp-htmlmin'),
	replace = require('gulp-replace'),
	fs = require('fs'),
	smoosher = require('gulp-smoosher');

function clean(){
	return del(['dist']);//Borra dist
}

function lint(){
	return gulp.src('www/js/*.js')//Abre los js
		.pipe(jshint())//Comprueba si hay errores
		.pipe(jshint.reporter('default'));//Devuelve el resultado
}
function Copy(){
	return merge(
		gulp.src(['www/*.html'])//Abre los html
			.pipe(removeCode({production: true}))//Saca todo el codigo entre <!--removeIf(production)--> y <!--endRemoveIf(production)-->
			.pipe(removeCode({cleanHeader: true}))//Saca todo el codigo entre <!--removeIf(cleanHeader)--> y <!--endRemoveIf(cleanHeader)-->
			.pipe(gulp.dest('dist')),//Los guarda en dist
		gulp.src(['www/img/*.*'])//Abre todas las imagenes
			.pipe(gulp.dest('dist/img'))//Las guarda en dist
	)
}
function concatApp(){
	return merge(
		gulp.src(['www/js/*.js'])//Abre los js
			.pipe(concat('app.js'))//Los agrega al archivo app.js
			.pipe(removeCode({production: true}))//Saca todo el codigo entre //removeIf(production) y //endRemoveIf(production)
			.pipe(removeCode({cleanHeader: true}))//Saca todo el codigo entre //removeIf(cleanHeader) y //endRemoveIf(cleanHeader)
			.pipe(gulp.dest('.dist/js')),//Lo guarda en dist
		gulp.src(['www/css/*.css'])//Abre los css
			.pipe(concat('style.css'))//Los agrega al archivo style.css
			.pipe(gulp.dest('.dist/css'))//Lo guarda en dist
	)
}
var checkjsSeries = gulp.series(lint);
var packageSeries = gulp.series(clean, lint, Copy, concatApp);
gulp.task('package', packageSeries);
gulp.task('checkjs', checkjsSeries);