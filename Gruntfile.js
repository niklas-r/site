'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    //////////////
    // Assemble //
    //////////////
    assemble: {
      options: {
        assets: 'dist/assets',
        data: ['src/templates/data/*.{json,yml}'],
        flatten: true,
        helpers: ['src/templates/helpers/helper-*.js'],
        layout: 'default.hbs',
        layoutdir: 'src/templates/layouts',
        partials: ['src/templates/includes/**/*.hbs']
      },
      pages: {
        files: {
          'dist/': ['src/templates/*.hbs']
        }
      },
      posts: {
        options: {
          layout: 'blog.hbs'
        },
        files: {
          'dist/blog/': ['src/templates/posts/*.md']
        }
      }
    },

    //////////
    // LESS //
    //////////
    less: {
      dev: {
        options: {
          paths: 'src/assets/styles/less',
          sourceMap: true
        },
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/less/main.less'
        }
      },
      prod: {
        options: {
          paths: 'src/assets/styles/less',
          cleancss: true
        },
        files: {
          'dist/assets/styles/main.css': 'src/assets/styles/less/main.less'
        }
      }
    },

    /////////////
    // Connect //
    /////////////
    connect: {
      server: {
        port: 8000,
        livereload: true,
        keepalive: true,
        directory: 'dist'
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  // Register tasks
  grunt.registerTask('default', ['newer:assemble', 'less:dev']);
};
