/**
 * Created by jacek on 01.03.16.
 */

module.exports = function(grunt) {

    grunt.initConfig({

        pkg : grunt.file.readJSON('package.json'),
        concat : {
            options : {
                stripBanners : true
            },
            release : {
                src : [
                    'src/module.js',
                    'src/**/*.js'
                ],
                dest : '.tmp/app.js'
            }
        },
        copy : {
            release : {
                src : '.tmp/app.js',
                dest : 'dist/<%= pkg.name %>.js'
            }
        },
        uglify : {
            options : {
                mangle: false
            },
            release : {
                files : {
                    'dist/<%= pkg.name %>.min.js' : 'dist/<%= pkg.name %>.js'
                }
            }
        },
        clean : {
            release : {
                src : '.tmp'
            }
        },
        sass : {
            style : {
                options: {
                    style : 'expanded'
                },
                files : {
                    'src/style.css' : 'src/scss/style.scss'
                }
            }
        },
        cssmin : {
            release : {
                files : {
                    'dist/<%= pkg.name %>.min.css' : ['src/style.css']
                }
            }
        },
        bump : {
            options : {
                files : ['package.json', 'bower.json'],
                updateConfigs : ['pkg'],
                commitFiles: ['-a'],
                tagName : '%VERSION%',
                push: 'tag',
                pushTo: 'origin'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-bump');


    grunt.registerTask('release', ['sass','concat:release','copy:release','uglify:release','cssmin:release','clean:release']);

    grunt.registerTask('r_patch',['release','bump:patch']);
}