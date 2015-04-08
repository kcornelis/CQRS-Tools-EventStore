module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-typescript');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-tslint');
	grunt.loadNpmTasks('grunt-force-task');

	grunt.initConfig({
		tslint: {
			options: {
				configuration: grunt.file.readJSON('tslint.json'),
				force: true
			},
			files: {
				src: ['lib/**/*.ts', 'tests/**/*.ts', 'cqrs-tools-eventstore.ts']
			}
		},
		typescript: {
			lib: {
				src: ['lib/**/*.ts', 'cqrs-tools-eventstore.ts'],
				options: {
					module: 'commonjs',
					target: 'es5'
				}
			},
			tests: {
				src: ['tests/**/*.ts'],
				options: {
					module: 'commonjs',
					target: 'es5',
					basePath: 'tests'
				}
			}
		},
		mochaTest: {
			src: [ 'tests/**/*.test.js' ],
			options: {
				reporter: 'spec'
			}
		}
	});

	grunt.registerTask('default', ['lint', 'build']);

	grunt.registerTask('lint', ['force:tslint']);
	grunt.registerTask('build', ['typescript:lib', 'typescript:tests']);
	grunt.registerTask('test', ['lint', 'build', 'mochaTest']);
};