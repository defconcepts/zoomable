var gulp = require('gulp'),
	coffee = require('gulp-coffee'),
	jade = require('gulp-jade'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	deploy = require('gulp-gh-pages'),
	filter = require('gulp-filter'),
	size = require('gulp-size'),
	sources = {
		coffee: "src/coffee/**/*.coffee",
		jade: 'src/jade/**/*.jade',
		docs: "src/jade/*.jade",
		overwatch: "./out/**/*.*",
		license: 'src/license/*.txt',
		build: 'out/js/*.js',
		dist: 'dist/**/*.*'
	},
	destinations = {
		js: './out/js/',
		docs: './out/',
		dist: './dist/'
	};
gulp.task('reload', function(event) {
	return gulp.src(sources.overwatch)
		.pipe(connect.reload());
});
gulp.task('serve', ['build'], function(event) {
	connect.server({
		root: destinations.docs,
		port: 1987,
		livereload: true
	});
	gulp.watch(sources.overwatch, ['reload']);
});
gulp.task('coffee:compile', function(event) {
	var coffeeFilter = filter('**/*.coffee');
	return gulp.src([sources.license, sources.coffee])
		.pipe(plumber())
		.pipe(coffeeFilter)
		.pipe(concat('zoomable.coffee'))
		.pipe(coffee())
		.pipe(coffeeFilter.restore())
		.pipe(concat('zoomable.js'))
		.pipe(gulp.dest(destinations.js))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(destinations.js));
});
gulp.task('coffee:watch', function(event) {
	gulp.watch(sources.coffee, ['coffee:compile']);
});
gulp.task('jade:compile', function(event) {
	return gulp.src(sources.docs)
		.pipe(plumber())
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(destinations.docs));
});
gulp.task('jade:watch', function(event){
	gulp.watch(sources.jade, ['jade:compile']);
});
gulp.task('dist', ['coffee:compile'], function(event) {
	return gulp.src(sources.build)
		.pipe(gulp.dest(destinations.dist));
});
gulp.task('build', ['jade:compile', 'coffee:compile']);

gulp.task('deploy', ['build'], function () {
	return gulp.src("out/**/*.*")
	.pipe(deploy());
});

gulp.task('stats', function(event) {
	return gulp.src(sources.dist)
	.pipe(size({
		showFiles: true
	}))
	.pipe(gulp.dest(destinations.dist));
});

gulp.task('default', ["serve", "jade:watch", "coffee:watch"]);
