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
        options: {
          livereload: true
        },
        files: [
          '<%= globals.dist %>/{,*/}*.html',
          '<%= globals.dist %>/assets/styles/main.css'
        ],
      },
      templates: {
        files: [
          '<%= assemble.options.data %>',
          '<%= assemble.options.helpers %>',
          '<%= assemble.options.layoutdir %>/*.hbs',
          '<%= assemble.options.partials %>',
          '<%= assemble.pages.cwd %>/*.hbs',
          '<%= assemble.posts.cwd %>/*.md'
        ],
        tasks: ['newer:assemble']
      },
      styles: {
        files: ['<%= globals.src %>/assets/styles/sass/{,*/}*.scss'],
        tasks: ['sass:build', 'autoprefixer:build']
      },
      scripts: {
        options: {
          livereload: true
        },
        files: ['<%= copy.js.cwd %>/**/*.js'],
        tasks: ['copy:js']
      }
    },

    assemble: {
      options: {
        assets: '<%= globals.dist %>/assets',
        data: ['<%= globals.src %>/data/*.{json,yml}'],
        flatten: true,
        helpers: ['<%= globals.src %>/templates/helpers/helper-*.js'],
        layout: 'default.hbs',
        layoutdir: '<%= globals.src %>/templates/layouts',
        partials: ['<%= globals.src %>/templates/includes/**/*.hbs']
      },
      pages: {
        expand: true,
        cwd: '<%= globals.src %>/templates/',
        src: ['*.hbs'],
        dest: '<%= globals.dist %>/'
      },
      posts: {
        options: {
          layout: 'blog.hbs'
        },
        expand: true,
        cwd: '<%= globals.src %>/templates/posts/',
        src: ['*.md'],
        dest: '<%= globals.dist %>/posts/'
      }
    },

    useminPrepare: {
      html: '<%= globals.dist %>/index.html',
      options: {
        dest: '<%= globals.dist %>'
      }
    },

    usemin: {
      html: '<%= globals.dist %>/{,*}/*.html'
    },

    sass: {
      options: {
        includePaths: [ '<%= globals.src %>/assets/styles/sass' ]
      },
      build: {
        files: {
          '<%= globals.dist %>/assets/styles/main.css': '<%= globals.src %>/assets/styles/sass/main.scss'
        }
      }
    },

    concat: {},
    cssmin: {},

    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      build: {
        src: ['<%= globals.dist %>/assets/styles/main.css']
      }
    },

    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 1337,
          livereload: true,
          open: true,
          base: [
            '<%= globals.dist %>/'
          ]
        }
      }
    },

    copy: {
      js: {
        expand: true,
        filter: 'isFile',
        cwd: '<%= globals.src %>/assets/',
        src: ['scripts/**/*.js', 'plugins/**/*.js'],
        dest: '<%= globals.dist %>/assets/'
      },
      bower: {
        expand: true,
        filter: 'isFile',
        cwd: './bower_components/',
        src: '**/*',
        dest: '<%= globals.dist %>/assets/bower_components/'
      }
    },

    clean: {
      full: ['<%= globals.dist %>'],
      temp: ['./.tmp'],
      postUsemin: [
        '<%= globals.dist %>/assets/**/*.+(js|css)',
        '!<%= globals.dist %>/assets/**/*.+(min.js|min.css)'
      ]
    }
  });

  grunt.loadNpmTasks('assemble');
  require('load-grunt-tasks')(grunt);

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'assemble',
    'copy',
    'sass:build',
    'autoprefixer:build'
  ]);

  grunt.registerTask('deploy', [
    'clean',
    'assemble',
    'copy',
    'sass:build',
    'autoprefixer:build',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'usemin',
    'clean:temp',
    'clean:postUsemin'
  ]);

  grunt.registerTask('serve', function(target) {
    var tasks;

    if ( target === 'prod' ) {
      tasks = tasks =[
        'deploy',
        'connect:server:keepalive'
      ];
    } else {
      tasks =[
        'default',
        'connect',
        'watch'
      ];
    }

    return grunt.task.run(tasks);
  });
};
