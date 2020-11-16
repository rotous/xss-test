const {watch, series, parallel, src, dest} = require('gulp');
const livereload = require('gulp-livereload');

const watchFormpost = () => {
	watch('formpost.css', reloadCssFormpost);
	watch('formpost.html', reloadHtmlFormpost);
	watch('formpost.js', reloadJsFormpost);
	console.log('Started watchers');

	// Start the livereload server
	livereload.listen();
	console.log('Started livereload server');

	console.log('Ready for action!');
};

const reloadCssFormpost = () => {
	return src('./*.css')
		.pipe(livereload());
};

const reloadHtmlFormpost = () => {
	return src('./formpost.html')
		.pipe(livereload());
};

const reloadJsFormpost = () => (
	src('./formpost.js')
		.pipe(livereload())
);

exports.watchFormpost = watchFormpost;
