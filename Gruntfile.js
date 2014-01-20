'use strict';

module.exports = function (grunt) {
  var globals = {
    src: 'src',
    dist: 'dist'
  };

  grunt.initConfig({
    globals: globals,
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      livereload: {
        // Here we watch the files the less/assemble tasks will compile to
        // These files are sent to the live reload server after less/assemble compiles to them
        options: { livereload: true },
        files: ['dist/**/*'],
      },
      templates: {
        files: ['<%= globals.src %>/**/*.hbs', '<%= globals.src %>/**/*.md', '<%= globals.src %>/**/*.json'],
        tasks: ['newer:assemble']
      },
      styles: {
        files: ['<%= globals.src %>/assets/styles/less/**/*.less'],
        tasks: ['less:dev']
      }
    },

    //////////////
    // Assemble //
    //////////////
    assemble: {
      options: {
        assets: '<%= globals.dist %>/assets',
        data: ['<%= globals.src %>/templates/data/*.{json,yml}'],
        flatten: true,
        helpers: ['<%= globals.src %>/templates/helpers/helper-*.js'],
        layout: 'default.hbs',
        layoutdir: '<%= globals.src %>/templates/layouts',
        partials: ['<%= globals.src %>/templates/includes/**/*.hbs']
      },
      pages: {
        files: {
          '<%= globals.dist %>/': ['<%= globals.src %>/templates/*.hbs']
        }
      },
      posts: {
        options: {
          layout: 'blog.hbs'
        },
        files: {
          '<%= globals.dist %>/blog/': ['<%= globals.src %>/templates/posts/*.md']
        }
      }
    },

    //////////
    // LESS //
    //////////
    less: {
      dev: {
        options: {
          paths: '<%= globals.src %>/assets/styles/less',
          sourceMap: true
        },
        files: {
          '<%= globals.dist %>/assets/styles/main.css': '<%= globals.src %>/assets/styles/less/main.less'
        }
      },
      prod: {
        options: {
          paths: '<%= globals.src %>/assets/styles/less',
          cleancss: true
        },
        files: {
          '<%= globals.dist %>/assets/styles/main.css': '<%= globals.src %>/assets/styles/less/main.less'
        }
      }
    },

    /////////////
    // Connect //
    /////////////
    connect: {
      server: {
        options: {
          port: 8000,
          livereload: true,
          keepalive: true,
          open: true,
          base: '<%= globals.dist %>/'
        }
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
  grunt.registerTask('serve', ['connect']);
};
