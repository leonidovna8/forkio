//Ініціалізуємо модулі які нам потрібні для тасок
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const imgmin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');

//Шляхи до файлів з якими ми працюватимемо (девелопмент файли)
const files = {
	scssPath: 'src/scss/**/*.scss',
	jsPath: 'src/js/**/*.js',
	imgPath: 'src/img/*',
	svgPath: 'src/icons/*',
}

// Static server
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./"
//         }
//     });
// });

function clear() {
	return gulp.src('./dist/*', {
		read: false
	})
		.pipe(clean());
}

exports.clear = clear;

//sass tasks - перетворення смарт css (scss, sass) у звичайний css

function buildStyles() {
	let plugins = [
		autoprefixer({overrideBrowserslist: ['last 1 version']}),
		cssnano()
	];
	return gulp.src(files.scssPath)
		.pipe(sass())
		.pipe(postcss(plugins))
		.pipe(gulp.dest('dist/css'));
				
};

exports.buildStyles = buildStyles;

//JS tasks - обєднання js файлів та мініфікація
function buildScripts() {
	return gulp.src(files.jsPath)
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
}

exports.buildScripts = buildScripts;

//Img task

function buildImages() {
	return gulp.src(files.imgPath)
		.pipe(imgmin())
		.pipe(gulp.dest("dist/img"))
}

exports.buildImages = buildImages;

//svg task

function buildSvg() {
	return gulp.src(files.svgPath)
		.pipe(svgmin())
		.pipe(gulp.dest("dist/icons"))
}

exports.buildSvg = buildSvg;

//watch task
function watchStyles() {
	gulp.watch(files.scssPath, buildStyles).on('change', browserSync.reload);
};

exports.watchStyles = watchStyles;

function watchScripts() {
	gulp.watch(files.jsPath, buildScripts).on('change', browserSync.reload);
}

exports.watchScripts = watchScripts;

//watch task
function watchTask() {
	gulp.watch([files.scssPath, files.jsPath], gulp.parallel(scssTask, jsTask))
}

exports.watchTask = watchTask;

function serve(cb) {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
	cb();
}

exports.serve = serve;

exports.dev = gulp.parallel(watchStyles, watchScripts, buildImages, buildSvg, serve);

//Deafult task
exports.default = gulp.series(
	clear,
	gulp.parallel(buildStyles, buildScripts, buildImages, buildSvg)
);