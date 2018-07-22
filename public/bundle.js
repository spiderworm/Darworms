(function () {
  'use strict';

  /**
   * Created with JetBrains WebStorm.
   * User: dmaynard
   * Date: 9/21/13
   * Time: 11:37 PM
   * To change this template use File | Settings | File Templates.
   */

  function Point(x, y) {
      this.x = x;
      this.y = y;
  }

  Point.prototype.isEqualTo = function(other) {
      return this.x == other.x && this.y == other.y;
  };

  Point.prototype.add = function( other) {
  //    console.log (" adding (" + other.x + "," + other.y + " to (" + this.x + "," + this.y );
      this.x = this.x + other.x;
      this.y = this.y + other.y;
    };

  Point.prototype.dist = function( other) {
      //  console.log (" dist from (" + other.x + "," + other.y + ") to (" + this.x + "," + this.y );
      return Math.sqrt((this.x - other.x ) * (this.x - other.x) +  (this.y - other.y) * (this.y - other.y));
  };

  Point.prototype.absDiff = function( other) {
      //  console.log (" dist from (" + other.x + "," + other.y + ") to (" + this.x + "," + this.y );
      return new Point( Math.abs(this.x-other.x) , Math.abs(this.y-other.y));

  };

  Point.prototype.wrap = function (wg, hg) {
      if (this.x >= wg) this.x = this.x - wg;
      if (this.x < 0) this.x = this.x + wg;
      if (this.y >= hg) this.y = this.y - hg;
      if (this.y < 0) {
          this.y = this.y + hg;
      }
  };
  Point.prototype.format = function( ) {
      return "(" + this.x + "," + this.y + ")";
  };

  window.darworms = {
    version: "0.9.0",
    compassPts: ["e", "se", "sw", "w", "nw", "ne", "unSet", "isTrapped"],
    gameStates: {
      "over": 0,
      "running": 1,
      "waiting": 2,
      "paused": 3,
      "animToUI": 4,
      "animFromUI": 5
    },
    gameStateNames: ["over", "running", "waiting", "paused", "to_ui", "from_ui"],

    outMask: [1, 2, 4, 8, 16, 32],
    inMask: [8, 16, 32, 1, 2, 4],
    colorNames: ['red', 'green', 'blue', 'yellow'],
    inDir: [3, 4, 5, 0, 1, 2],
    wCanvasPixelDim: [0, 0],
    playPageIitialized: false,
    wCanvasRef: undefined,
    minTwoColumnWidth: 480,
    leftColumnWidth: 320,
    screens: {},
    pickCells: [],
    graphics: {
      timer: undefined,
      scorectx: undefined,
      animFrame: 0,
      uiFrames: 0,
      rawFrameCount: 0,
      drawFrameCount: 0,
      uiFrameCount: 0,
      xPts: [0.5, 0.25, -0.25, -0.5, -0.25, 0.25],
      yPts: [0.0, 0.5, 0.5, 0.0, -0.5, -0.5],
      fps: 30,
      frameInterval: 33.33333,
      uifps: 30,
      uiInterval: 33.33333,
      startTime: 0,
      now: 0,
      then: 0,
      uiThen: 0,
      elapsed: 0,
      uiElapsed: 0,
      enableTransitionStates: false,
      vertex_x: [0.5, 0.5, 0, -0.5, -0.5, 0],
      vertex_fudge: 0.12,
      vertex_y: [0.3125, -0.3125, -0.6875, -0.3125, 0.3125, 0.6875],
      hexSize: 1.0,
      sqrt3: Math.sqrt(3),
      dyningAnimationFrames: 8

    },
    selectedDarworm: 0,
    notes: {
      C1: 0,
      CS: 1,
      DF: 1,
      D: 2,
      DS: 3,
      EF: 3,
      E: 4,
      F: 5,
      FS: 6,
      GF: 6,
      G: 7,
      GS: 8,
      FF: 8,
      AF: 8,
      A: 9,
      AS: 10,
      BF: 10,
      B: 11,
      C2: 12
    },

    dwsettings: {
      vgridsize: 1.0,
      initialGridSize: 10,
      doAudio: true,
      fixedInitPos: true,
      panToSelectionUI: 0,
      pickDirectionUI: 0,
      noWhere: undefined,

      scoreCanvas: undefined,
      gridGeometry: "torus",
      compassPts: ["e", "ne", "nw", "w", "sw", "se", "unSet", "isTrapped"],

      codons: {
        "e": 0,
        "ne": 1,
        "nw": 2,
        "w": 3,
        "sw": 4,
        "se": 5,
        "unSet": 6,
        "isTrapped": 7
      },
      colorTable: ["#000000", "#EE0000", "#00EE00", "#0404EE",
        "#D0A000", "#448833", "#443388", "#338844",
        "#FF1C0A", "#1CFF0A", "#1C0AFF", "#0AFF1C",
        "#884433", "#448833", "#443388", "#338844"
      ],
      alphaColorTable: ["rgba(  0,   0,   0, 0.2)",
        "rgba(  238,   0,   0, 0.4)", "rgba(    0, 238,   0, 0.4)", "rgba(    0,   0, 238, 0.4)", "rgba(  200, 200, 0, 0.4)",
        "#FFD70080", "#44883380", "#44338880", "#33884480",
        "#FF1C0A80", "#1CFF0A80", "#1C0AFF80", "#0AFF1C80",
        "#88443380", "#44883380", "#44338880", "#33884480"
      ],
      backGroundTheme: 0,
      doAnimations: true,
      gridBackground: ["#F5F5F5", "#404040"],
      cellBackground: ["#F5F5F5", "#404040"]

    },
    images: {},
    audioContext: undefined,
    masterGainNode: undefined,
    masterAudioVolume: 0.3,
    audioPanner: undefined,
    audioSamples: [],
    // an array of 12 playback rates ranging from 0.5 to 1.0
    // this gives 12 notes from an octave in an equal tempered scale.
    audioPlaybackRates: [],
    audioFrequencies: []

  };

  window.addEventListener("load", function() {


      console.log(" stage 1 loading finished");

      window.onerror = function(msg, url, line) {
        alert(msg + " " + url + " " + line);
      };
      $("[data-darworm='selector']").on('pageshow', darworms.main.setupRadioButtons);
      $("[data-darworm='selector']").on('pagehide', darworms.main.setSelectedDarwormType);
      $("#settingspage").on('pageshow', darworms.main.showSettings);
      $("#settingspage").on('pagebeforeshow', darworms.main.setupGridGeometry);
      $("#settingspage").on('pagehide', darworms.main.applySettings);
      $("#playpage").on('pageshow', darworms.main.initPlayPage);
      $( "#tutorialpopup" ).popup({
          afterclose: function( event, ui ) {
            console.log(" afterclose even fired" + $('#tutorialpopup input[type=checkbox]').prop("checked"));
            if ( $('#tutorialpopup input[type=checkbox]').prop("checked") ) {
              darworms.theGame.focusWorm.showTutorial = false;
            }

          }
  });
      darworms.wCanvasPixelDim = new Point();
      console.log("Initial Screen Size " + darworms.wCanvasPixelDim.format());
      darworms.main.init();

    }

  );

  /**
   * Created by dmaynard on 1/19/15.
   */

  function AudioSample(name, location) {
      this.location = location;
      this.name = name;
      this.incomingbuffer = undefined;
      this.savedBuffer = undefined;
      var xhr = new XMLHttpRequest();
      xhr.open('get',location, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = (function () {
          darworms.audioContext.decodeAudioData(xhr.response,
              (function(incomingBuffer) {
                  // console.log( "on Load incoming Buffer");
                  // console.log(" xhr " + xhr.status + "  " + xhr.statusText);
                  // console.log(" incoming buffer = " + incomingBuffer );
                  // console.log ( " this.name " + this.name);
                  this.savedBuffer = incomingBuffer; // Save the buffer, we'll reuse it
              }
          ).bind(this));
      }).bind(this);
      xhr.send();
      darworms.audioSamples.push(this);
  }

  AudioSample.prototype.playSample = function (rate, pan) {
      var source;
      // console.log(" playSample " + this.name + "  " + this.location + "  savedBuffer " + this.savedBuffer);
      if (darworms.audioContext !== undefined && this.savedBuffer !== undefined) {
          // Do we have to create a new buffer every time we play a note ?
          source = darworms.audioContext.createBufferSource();
          source.buffer = this.savedBuffer;
          darworms.masterGainNode.gain.value = darworms.masterAudioVolume;
          source.connect(darworms.masterGainNode);
          // console.log(" playSample " + this.name + " volume  " + darworms.masterGainNode.gain.value);
          if ( darworms.audioPanner !== undefined ) {
            darworms.masterGainNode.connect(darworms.audioPanner);
            darworms.audioPanner.connect(darworms.audioContext.destination);
          }
          else {
            darworms.masterGainNode.connect(darworms.audioContext.destination);
          }

          if ( darworms.audioPanner !== undefined ) {
            darworms.audioPanner.pan.value = (pan * 0.80) ;  // jump cut is too harsh
          }
          source.start(0); // Play sound immediately. Renamed source.start from source.noteOn
          if (rate ) {
            source.playbackRate.value = rate;
          }

      }
  };

  /**
   * Created with JetBrains WebStorm.
   * User: dmaynard
   * Date: 9/21/13
   * Time: 11:57 PM
   * To change this template use File | Settings | File Templates.
   */
  /*    Grid   */
  darworms.gridModule = (function() {
    var evenRowVec = [new Point(1, 0), new Point(0, 1), new Point(-1, 1),
      new Point(-1, 0), new Point(-1, -1), new Point(0, -1)
    ];


    var oddRowVec = [new Point(1, 0), new Point(1, 1), new Point(0, 1),
      new Point(-1, 0), new Point(0, -1), new Point(1, -1)
    ];
    //  although we reserve 4 bits for each direction we actually only use 3 bits
    var spokeMask = [0xFFFFFFF0,
      0xFFFFFF0F,
      0xFFFFF0FF,
      0xFFFF0FFF,
      0xFFF0FFFF,
      0xFF0FFFFF,
      0xF0FFFFFF,
      0x0FFFFFFF
    ];
    // sink mask is high bit of spoke 6
    var sinkMask = 0x08000000;

    function Grid(width, height) {
      this.width = Math.floor(width);
      this.height = Math.floor(height);


      //  Cell Format   8 bits each:  in-spoke eaten, out-spoke eaten, spoke eaten
      this.cells = new Array(width * height);

      //  7 * 4 bits of color index info for color of each spoke and center
      this.colors = new Array(width * height);
      this.animFraction = new Array(width * height);
      for (var i = 0; i < width * height; i = i + 1) {
        /* 6 bits of each of in, out, and taken hi-to-low */
        this.cells[i] = 0;
        this.colors[i] = 0;
        this.animFraction = 0;
      }
    }
    Grid.prototype.clear = function() {
      for (var i = 0; i < this.width * this.height; i = i + 1) {
        this.cells[i] = 0;
        this.colors[i] = 0;
      }
      if (darworms.dwsettings.gridGeometry == 'reflect') {
        for (var i = 0; i < this.width; i = i + 1) {
          var topPoint = new Point(i, 0);
          var botPoint = new Point(i, this.height - 1);

          this.setValueAt(topPoint, this.valueAt(topPoint) | darworms.outMask[4] | darworms.outMask[5]); // block up
          this.setValueAt(topPoint, this.valueAt(topPoint) | ((this.valueAt(topPoint) & 0x3F) << 8)); // set outvec
          this.setSpokeAt(topPoint, 4, 0);
          this.setSpokeAt(topPoint, 5, 0);
          this.setSpokeAt(topPoint, 6, 0);
          this.setValueAt(botPoint, this.valueAt(botPoint) | darworms.outMask[1] | darworms.outMask[2]); // block down
          this.setValueAt(botPoint, this.valueAt(botPoint) | ((this.valueAt(botPoint) & 0x3F) << 8)); // set outvecs
          this.setSpokeAt(botPoint, 1, 0);
          this.setSpokeAt(botPoint, 2, 0);
          this.setSpokeAt(botPoint, 6, 0);

        }
        for (var j = 0; j < this.height; j = j + 1) {
          var leftPoint = new Point(0, j);
          var rightPoint = new Point(this.width - 1, j);

          if ((j & 1) == 0) { // even rows shifted left 1/2 cell
            this.setValueAt(leftPoint, this.valueAt(leftPoint) | darworms.outMask[2] | darworms.outMask[3] | darworms.outMask[4]); // block left
            this.setValueAt(leftPoint, this.valueAt(leftPoint) | ((this.valueAt(leftPoint) & 0x3F) << 8)); // set outvecs
            this.setSpokeAt(leftPoint, 2, 0);
            this.setSpokeAt(leftPoint, 3, 0);
            this.setSpokeAt(leftPoint, 4, 0);
            this.setSpokeAt(leftPoint, 6, 0);
            this.setValueAt(rightPoint, this.valueAt(rightPoint) | darworms.outMask[0]); //block right
            this.setValueAt(rightPoint, this.valueAt(rightPoint) | ((this.valueAt(rightPoint) & 0x3F) << 8)); // set outvecs
            this.setSpokeAt(rightPoint, 0, 0);
            this.setSpokeAt(rightPoint, 6, 0);
          } else { // odd rows shifted right on cell
            this.setValueAt(leftPoint, this.valueAt(leftPoint) | darworms.outMask[3]); // block left
            this.setValueAt(leftPoint, this.valueAt(leftPoint) | ((this.valueAt(leftPoint) & 0x3F) << 8)); // set outvecs
            this.setSpokeAt(leftPoint, 3, 0);
            this.setSpokeAt(leftPoint, 6, 0);
            this.setValueAt(rightPoint, this.valueAt(rightPoint) | darworms.outMask[5] | darworms.outMask[0] | darworms.outMask[1]); //block right
            this.setValueAt(rightPoint, this.valueAt(rightPoint) | ((this.valueAt(rightPoint) & 0x3F) << 8)); // set outvecs
            this.setSpokeAt(rightPoint, 5, 0);
            this.setSpokeAt(rightPoint, 0, 0);
            this.setSpokeAt(rightPoint, 1, 0);
            this.setSpokeAt(rightPoint, 6, 0);
          }
        }
      }
    };
    Grid.prototype.valueAt = function(point) {
      return this.cells[point.y * this.width + point.x];
    };
    Grid.prototype.hexValueAt = function(point) {
      return (" 0x" + (this.valueAt(point)).toString(16));
    };
    Grid.prototype.stateAt = function(point) {
      return this.valueAt(point) & 0x3F;
    };
    Grid.prototype.outVectorsAt = function(point) {
      return (this.valueAt(point) >> 8) & 0x3F;
    };
    Grid.prototype.inVectorsAt = function(point) {
      return (this.valueAt(point) >> 16) & 0x3F;
    };
    Grid.prototype.spokeAt = function(point, dir) {
      return (this.colors[point.y * this.width + point.x] >>> (dir * 4)) & 0x07;
    };
    Grid.prototype.colorsAt = function(point) {
      return (this.colors[point.y * this.width + point.x]);
    };

    Grid.prototype.setSpokeAt = function(point, dir, colorIndex) {
      this.colors[point.y * this.width + point.x] =
        ((this.colors[point.y * this.width + point.x]) & spokeMask[dir]) |
        ((colorIndex & 0x0F) << (dir * 4));

    };
    Grid.prototype.setValueAt = function(point, value) {
      this.cells[point.y * this.width + point.x] = value;
    };

    Grid.prototype.setSinkAt = function(point) {
      this.cells[point.y * this.width + point.x] =
          (this.cells[point.y * this.width + point.x] ^ sinkMask);
    };

    Grid.prototype.isSink = function(point) {
      return ( (this.cells[point.y * this.width + point.x] & sinkMask) !== 0);
    };

    Grid.prototype.isInside = function(point) {
      return point.x >= 0 && point.y >= 0 &&
        point.x < this.width && point.y < this.height;
    };
    Grid.prototype.move = function(from, to, dir, colorIndex) {
      if ((this.inVectorsAt(to) & darworms.inMask[dir]) !== 0) {
        alert(" Attempted to eat eaten spoke at " + to.format());
        console.log("  (" + to.x + "," + to.y + ") dir: " + dir + " value: ");
        console.log("Attempted to eat eaten spoke at " + to.format() + " dir " + dir + " value: 0x" + this.valueAt(to).toString(16));
      }
      this.setValueAt(to, this.valueAt(to) | darworms.inMask[dir] | (darworms.inMask[dir] << 16));
      this.setValueAt(from, this.valueAt(from) | darworms.outMask[dir] | (darworms.outMask[dir] << 8));
      this.setSpokeAt(from, dir, colorIndex);
      this.setSpokeAt(from, 6, colorIndex);
      this.setSpokeAt(to, darworms.inDir[dir], colorIndex);
      this.setSpokeAt(to, 6, colorIndex);
      var captures = 0;
      if (this.stateAt(to) === 0x3f) {
        this.setSpokeAt(to, 6, colorIndex);
        this.setSpokeAt(to, 7, colorIndex);

        captures = captures + 1;
      }
      if (this.stateAt(from) === 0x3f) {
        this.setSpokeAt(from, 6, colorIndex);
        this.setSpokeAt(from, 7, colorIndex);

        captures = captures + 1;
      }
      return captures;
    };
    // Returns next x,y position
    Grid.prototype.next = function(point, dir) {
      var nP = new Point(point.x, point.y);
      // console.log ("  (" + point.x  + "," + point.y + ") dir: " + dir);
      if ((point.y & 1) === 0) {
        nP.add(evenRowVec[dir]);
      } else {
        nP.add(oddRowVec[dir]);
      }
      if ((darworms.dwsettings.gridGeometry == 'falloff' && ((nP.x < 0) || (nP.x > this.width - 1) || (nP.y < 0) || (nP.y > this.height - 1)))) {
        // console.log ("  (" + nP.x  + "," + nP.y + ") returning noWhere");
        return darworms.dwsettings.noWhere;
      }
      if (nP.x < 0) {
        nP.x = this.width - 1;
      }
      if (nP.x > this.width - 1) {
        nP.x = 0;
      }
      if (nP.y < 0) {
        nP.y = this.height - 1;
      }
      if (nP.y > this.height - 1) {
        nP.y = 0;
      }
      // console.log ("    next from: (" + point.format()  + " dir " + dir + " next:  " + nP.format());
      return nP;
    };
    Grid.prototype.each = function(action) {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var point = new Point(x, y);
          action(point, this.valueAt(point));
        }
      }
    };
    Grid.prototype.logSpokesAt = function(point) {
      console.log("[ " + point.x + "," + point.y + "] val = " + this.colorsAt(point).toString(16));
      for (var dir = 0; dir < 8; dir = dir + 1) {
        console.log("   spoke: " + dir + " colorindex" + this.spokeAt(point, dir));

      }
    };
    Grid.prototype.logValueAt = function(point) {
      console.log("[ " + point.x + "," + point.y + "] val = 0x" + this.hexValueAt(point) +
        this.dirList(this.hexValueAt(point)) + " outVectors = 0x" +
        this.outVectorsAt(point).toString(16) + this.dirList(this.outVectorsAt(point)) +
        " inVectors = 0x" + this.inVectorsAt(point).toString(16));
    };
    Grid.prototype.formatStateAt = function(point) {
      return " x " + point.x + " y " + point.y + " state 0x" + this.stateAt(point).toString(16);
    };
    Grid.prototype.dirList = function(state) {
      var list = " directions ";
      for (var dir = 0; dir < 6; dir = dir + 1) {
        if (((state & darworms.outMask[dir]) !== 0)) {
          list = list + " " + darworms.compassPts[dir];
        }
      }
      return list;
    };
    return {
      Grid: Grid
    };

  })();
  /* end Grid */

  /**
   * Created with JetBrains WebStorm.
   * User: dmaynard
   * Date: 9/22/13
   * Time: 12:00 AM
   * To change this template use File | Settings | File Templates.
   */
  /* Worm Object */
  function Worm(colorIndex, state) {
    this.colorIndex = colorIndex;
    this.dna = new Array(64);
    this.state = state;
    this.nMoves = 0;
    this.score = 0;
    this.prevScore = 0;
    this.numChoices = 0;
    this.died = false;
    this.name = "";
    this.wType = 0; // None (asleep)
    this.directionIndex = 0;
    this.diedAtFrame = 0;
    this.showTutorial = true;

    this.musicalkeys = {
      "AMajor": [
        darworms.notes.A,
        darworms.notes.B,
        darworms.notes.CS,
        darworms.notes.D,
        darworms.notes.E,
        darworms.notes.FS,
        darworms.notes.GS
      ],
      "BMajor": [
        darworms.notes.B,
        darworms.notes.CS,
        darworms.notes.DS,
        darworms.notes.E,
        darworms.notes.FS,
        darworms.notes.GS,
        darworms.notes.AS
      ],
      "CMajor": [
        darworms.notes.C1,
        darworms.notes.D,
        darworms.notes.E,
        darworms.notes.F,
        darworms.notes.G,
        darworms.notes.A,
        darworms.notes.B
      ],
      "CMinor": [
        darworms.notes.C1,
        darworms.notes.D,
        darworms.notes.EF,
        darworms.notes.F,
        darworms.notes.G,
        darworms.notes.AF,
        darworms.notes.BF
      ],

      "DMajor": [
        darworms.notes.D,
        darworms.notes.E,
        darworms.notes.FS,
        darworms.notes.G,
        darworms.notes.A,
        darworms.notes.B,
        darworms.notes.CS
      ],

      "EMajor": [
        darworms.notes.E,
        darworms.notes.FS,
        darworms.notes.GS,
        darworms.notes.A,
        darworms.notes.B,
        darworms.notes.CS,
        darworms.notes.DS
      ],
      "FMajor": [
        darworms.notes.F,
        darworms.notes.G,
        darworms.notes.A,
        darworms.notes.BF,
        darworms.notes.C2,
        darworms.notes.D,
        darworms.notes.E
      ],
      "GMajor": [
        darworms.notes.G,
        darworms.notes.A,
        darworms.notes.B,
        darworms.notes.C2,
        darworms.notes.D,
        darworms.notes.E,
        darworms.notes.FS
      ]
    };

    this.MusicScale = [],

    this.audioSamplesPtrs = [];
    this.pos = new Point(-1, -1);

    for (var i = 0; i < 64; i = i + 1) {
      this.dna[i] = darworms.dwsettings.codons.unSet;
    }

    this.dna[63] = darworms.dwsettings.codons.isTrapped;
    this.numChoices = 1;
    // set all the forced moves
    for (var j = 0; j < 6; j = j + 1) {
      this.dna[0x3F ^ (1 << j)] = j;
      this.numChoices += 1;
    }
    this.randomize();
    this.toText();
  }

  Worm.prototype.init = function(wType) {
    this.nMoves = 0;
    this.score = 0;
    this.prevScore = 0;
    this.MusicScale = this.musicalkeys["CMajor"];
    if (wType === 0) { // none   asleep
      this.state = 3; // sleeping
    }
    if (wType === 1) { // random
      for (var i = 0; i < 64; i = i + 1) {
        this.dna[i] = darworms.dwsettings.codons.unSet;
      }
      this.dna[63] = darworms.dwsettings.codons.isTrapped;
      this.numChoices = 1;
      // set all the forced moves
      for (var j = 0; j < 6; j = j + 1) {
        this.dna[0x3F ^ (1 << j)] = j;
        this.numChoices += 1;
      }
      this.randomize(); // sleeping
    }
    if (wType === 2) { // same
      this.state = 2; // paused
    }
    if (wType === 3) { // new
      for (var k = 0; k < 64; k = k + 1) {
        this.dna[k] = darworms.dwsettings.codons.unSet;
      }
      this.dna[63] = darworms.dwsettings.codons.isTrapped;
      this.numChoices = 1;
      // set all the forced moves
      for (var n = 0; n < 6; n = n + 1) {
        this.dna[0x3F ^ (1 << n)] = n;
        this.numChoices += 1;
      }
      this.state = 2; // paused
    }
    this.toText();
  };

  Worm.prototype.setNotes = function(index) {
    this.audioSamplesPtrs.length = 0;
    for (var j = 0; j < 7; j = j + 1) {
      this.audioSamplesPtrs.push(index); // c2,wav
    }

  };
  Worm.prototype.setKey = function(keyName) {
    console.log(" keyname: " + keyName);
    this.MusicScale = this.musicalkeys[keyName];
  };

  Worm.prototype.playScale = function() {
    for (var j = 0; j < 7; j = j + 1) {
      darworms.directionIndex = j;
      var sorted = this.MusicScale;
      sorted.sort(function (a, b) {  return a - b;  });
      setTimeout(function(that, index, notes) {
        if (that.audioSamplesPtrs[index] >= 0) {
          darworms.audioSamples[that.audioSamplesPtrs[index]].
        playSample(darworms.audioPlaybackRates[notes[index]], 0.0);
      }
        //do what you need here
      }, 500 * j, this, j, sorted);

    }
  };
  Worm.prototype.getMoveDir = function(value) {
    if (value === 0x3F) { // trapped
      this.state = wormStates.dead;
      this.died = true;
      return 6;
    }
    return this.dna[value & 0x3F];
  };
  Worm.prototype.shouldDrawScore = function() {
    if (this.score !== this.prevScore || (this.nMoves <= 2)) {
      this.prevScore = this.score;
      return true;
    }
    if (this.died) {
      this.died = false; // one-shot
      return true;
    }
    return false;
  };
  Worm.prototype.randomize = function() {
    var dir;
    for (var i = 0; i < 63; i = i + 1) {
      // console.log(" randomize loop start  i = " + i + " dna[i] = " + this.dna[i]);
      if (this.dna[i] === darworms.dwsettings.codons.unSet) {
        for (var j = 0; j < 1000; j = j + 1) {
          dir = Math.floor(Math.random() * 6);
          //console.log( " dir = " + dir +  " i=" + i + " outMask[dir] = " + outMask[dir] + "& = " + (i & outMask[dir]));
          if ((i & darworms.outMask[dir]) === 0) {
            this.dna[i] = dir;
            this.numChoices += 1;
            // console.log(" Setting dir 0x" + i.toString(16) + " to " + compassPts[dir]);
            break;
          }
        }
        if (this.dna[i] === darworms.dwsettings.codons.unSet) {
          console.log("Error we rolled craps 10,000 times in a row");
        }
      }
      // console.log(" randomize loop end  i = " + i + " dna[i] = " + this.dna[i]);
    }
    this.toText();
  };
  Worm.prototype.log = function() {
    console.log(" Worm State: " + wormStateNames[this.state] + " at " + (this.pos !== undefined ? this.pos.format() : "position Undefined"));
  };
  Worm.prototype.place = function(aState, aGame, pos) {
    this.pos = pos;
    this.nMoves = 0;
    this.score = 0;
    this.state = aState;
    console.log(" placing worm   i = " + this.colorIndex + " state " + aState + " " + this.numChoices + " of 64 possible moves defined");
  };
  Worm.prototype.dump = function() {
    this.log();
    for (var i = 0; i < 64; i = i + 1) {
      console.log(" dna" + i + " = " + darworms.compassPts[this.dna[i]]);
      var spokes = [];
      for (var spoke = 0; spoke < 6; spoke = spoke + 1) {
        if ((i & darworms.outMask[spoke]) !== 0) {
          spokes.push(compassPts[spoke]);
        }
      }
      console.log(" dna" + i + " " + spokes + " = " + compassPts[this.dna[i]]);
    }

  };
  Worm.prototype.toText = function() {
    this.name = "";

    for (var i = 0; i < 64; i = i + 1) {
      if (this.dna[i] === 0) this.name += 'A';
      if (this.dna[i] === 1) this.name += 'B';
      if (this.dna[i] === 2) this.name += 'C';
      if (this.dna[i] === 3) this.name += 'D';
      if (this.dna[i] === 4) this.name += 'E';
      if (this.dna[i] === 5) this.name += 'F';
      if (this.dna[i] === 6) this.name += '?';
      if (this.dna[i] === 7) this.name += 'X';
      if (this.dna[i] > 7) this.name += '#';
    }};
  var compassPts = ["e", "ne", "nw", "w", "sw", "se", "unSet", "isTrapped"];

  Worm.prototype.fromText = function(dnastring) {
    var regx = /^[ABCDEF\?]{63}X$/;
    if (!(regx.test(dnastring))) {
      return false;
    }
    var gooddna = true;
    for (var i = 0; i < 63; i = i + 1) {
      switch (dnastring.charAt(i)) {
        case 'A':
          this.dna[i] = 0;
          break;
        case 'B':
          this.dna[i] = 1;
          break;
        case 'C':
          this.dna[i] = 2;
          break;
        case 'D':
          this.dna[i] = 3;
          break;
        case 'E':
          this.dna[i] = 4;
          break;
        case 'F':
          this.dna[i] = 5;
          break;
        case '?':
          this.dna[i] = 6;
          break;
        default:
          alert(" illegal dna string at position " + (i + 1));
          return (false);
      }
      if (!(((1 << this.dna[i]) & i) === 0) && (this.dna[i] !== 6)) {
        alert("illegal direction " + dnastring.charAt(i) + "(" + compassPts[this.dna[i]] +
          ")" + "given for cell " + i);
        gooddna = false;
      }
    }
    if (gooddna) {
      this.toText();
    }
    return gooddna;
  };

  /* end of Worm */

  /**
   * Created with JetBrains WebStorm.
   * User: dmaynard
   * Date: 9/22/13
   * Time: 12:05 AM
   * To change this template use File | Settings | File Templates.
   */
  /* WPane

   an object containing grid a canvas a scale and an offset
   * can draw the grid points inside the canvas
   *
   *  grid is the game grid
   *  paneSize is the number of grid items to display w,h
   *  centerPoint  the x,y coordinates of the
   *  canvas
   *  scale ?
   *  margin ?
   *
   */
  function WPane ( grid, size, center, canvas) {
      this.grid = grid;
      this.canvas = canvas;
      this.pWidth = canvas.width;
      this.pHeight = canvas.height;
      this.savedCanvas = null;
      this.canvasIsDirty = true;
      this.focus = center;
      this.ctx = canvas.getContext("2d");
      this.cWidth = size.x;
      this.cHeight =  size.y;
      this.pMargin  = 10;
      //this.scale = new Point((this.pWidth - (2*this.pMargin))/(this.cWidth === 1 ? this.cWidth : this.cWidth+0.5),
      //    (this.pHeight- (2*this.pMargin))/(this.cHeight === 1 ? this.cHeight :this.cHeight+0.5));
      this.scale = new Point((this.pWidth / this.cWidth) ,
          (this.pHeight/ this.cHeight ));
      this.offset = new Point(center.x - (this.cWidth >> 1), center.y - (this.cHeight >>1));
      this.offset.wrap(this.grid.width, this.grid.height);
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.scale.x, this.scale.y);
      this.savedCanvas = document.createElement('canvas');
      this.savedCtx = this.savedCanvas.getContext('2d');
      this.savedCanvas.width = this.canvas.width;
      this.savedCanvas.height = this.canvas.height;



  }
  WPane.prototype.clear = function() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      // background for user selct direction screen
      this.ctx.fillStyle =  darworms.dwsettings.cellBackground[darworms.dwsettings.backGroundTheme];

      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.pWidth, this.pHeight);
      this.ctx.closePath();
      this.ctx.fill();
  };


  WPane.prototype.setCenter = function ( center, size ) {
      // sets the scale, screen offset, and
      // centers the focused point on the canvas
      // should be called whenever the focus point changes
      // or the user zooms in or out.
      // console.log( " WPane.prototype.setCenter  center: "   + center.format() + " zoomSize: "  + size.format() );
      // If we are changing scale we have to invalidate the cached background image
      if ( size.x != this.cWidth || size.y != this.cHeight) {
          this.savedCtx = null;
      }    // console.log( "     WPane.prototype.setCenter  offset: "   + this.offset.format()  );
      this.cWidth = size.x;
      this.cHeight = size.y;

      this.scale = new Point((this.pWidth - (2*this.pMargin))/(this.cWidth === 1 ? this.cWidth : this.cWidth+0.5),
          (this.pHeight- (2*this.pMargin))/(this.cHeight === 1 ? this.cHeight :this.cHeight+0.5));
      this.offset = new Point(center.x - Math.floor(this.cWidth /2), center.y - Math.floor(this.cHeight /2));
      this.offset.wrap(this.grid.width, this.grid.height);
      // console.log( "         WPane.prototype.setCenter  offset after wrap : "   + this.offset.format()  );

  };
  WPane.prototype.setSize = function ( size ) {
      // sets the scale, screen offset, and

      // console.log( " WPane.prototype.setCenter  center: "   + center.format() + " zoomSize: "  + size.format() );
      // If we are changing scale we have to invalidate the cached background image
      //if ( size.x != this.cWidth || size.y != this.cHeight) {
      //    this.savedCtx = null;
      //};
      console.log( "     WPane.prototype.setSize  size: "   + size.format()  );
      this.cWidth = size.x;
      this.cHeight = size.y;

      this.scale = new Point((this.pWidth - (2*this.pMargin))/(this.cWidth === 1 ? this.cWidth : this.cWidth+0.5),
          (this.pHeight- (2*this.pMargin))/(this.cHeight === 1 ? this.cHeight :this.cHeight+0.5));
      // console.log( "     WPane.prototype.setSize  scale.x: "   + this.scale.x  + " yscale " + this.scale.x);
      // console.log(this.scale.format() );
  };
  WPane.prototype.drawCells = function () {
      this.clear();
      var gPos = new Point(this.offset.x,this.offset.y);
      if (this.canvasIsDirty) {
          for (var col = 0; col < this.cWidth ; col = col + 1) {
              for (var row = 0; row < this.cHeight ; row = row + 1) {
                  /* at this pane coordinate draw that grid cell content  */
                  this.drawCell(new Point(col,row), gPos);
                  gPos.y = gPos.y + 1;
                  if (gPos.y >= this.grid.height ) {gPos.y = 0;}
              }
              gPos.y = this.offset.y;
              gPos.x = gPos.x + 1;
              if (gPos.x >= this.grid.width ) {gPos.x = 0;}
          }
          // TODO  this should be a backbuffer and should only be created once
          // or created every time the canvas changes size
          // it should not be created on every refresh of the selection screen
          this.savedCtx.drawImage(this.canvas,0,0);
          this.canvasIsDirty = false;
          this.savedCtx.font = "bold 18px sans-serif";
          this.savedCtx.fillStyle = darworms.dwsettings.colorTable[0];
          this.savedCtx.shadowColor = "rgb(190, 190, 190)";
          this.savedCtx.shadowOffsetX = 3;
          this.savedCtx.shadowOffsetY = 3;
          this.savedCtx.fillText("-",this.savedCanvas.width/2, 10);
          this.savedCtx.fillText("+",this.savedCanvas.width/2, this.savedCanvas.height - 10);

      }  else { // use the saved canvas background for this size

          // offset is wrong
          // this overwrites the previous image instead of being transparent
          this.ctx.drawImage(this.savedCanvas,0,0);
      }
  };
  WPane.prototype.pSetTransform = function (point) {
      var xoff;
      var yoff;
      if (( (point.y+this.offset.y) & 1) === 0 || (this.cWidth == 1)) {
          xoff = (point.x + 0.5 ) * this.scale.x + this.pMargin;
      } else {
          xoff = (point.x + 1.0 )  * this.scale.x  + this.pMargin;

      }
      // because screen is N+.5 cells wide and only N cells high
      // we need extra vertical margins
      yoff = (point.y + 0.5 ) * this.scale.y + this.pMargin + (this.scale.y/4.0);
      this.ctx.setTransform(this.scale.x,0,0,this.scale.y,xoff,yoff);
  };
  /* WPane.drawCell(wPoint, gPoint)
   *
   * in the pane at Position WPoint draw the cell for global grid pointer gPoint
   *
   */
  WPane.prototype.drawCell = function( wPoint,  gPoint) {
      // console.log( " WPane.prototype.drawCell wPoint "   + wPoint.format() + "  gPoint "  + gPoint.format() );

      this.pSetTransform(wPoint);
      /*
       this.ctx.fillStyle =  "rgba(080,222,222,0.5)";

       this.ctx.beginPath();
       this.ctx.rect(-0.5, -0.5, 1.0, 1.0);
       this.ctx.closePath();
       this.ctx.fill();
       */
      var owner = this.grid.spokeAt( gPoint, 7);
      if (owner > 0 ) {
          this.ctx.fillStyle = darworms.dwsettings.alphaColorTable[owner & 0xF];
          this.ctx.beginPath();
          this.ctx.moveTo(darworms.graphics.vertex_x[0],darworms.graphics.vertex_y[0]);
          for (var j = 1; j < 6 ; j = j + 1) {
              this.ctx.lineTo(darworms.graphics.vertex_x[j], darworms.graphics.vertex_y[j]);
          }
          // this.ctx.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
          this.ctx.stroke();
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();    } else {
          this.ctx.fillStyle = darworms.dwsettings.cellBackground[1-darworms.dwsettings.backGroundTheme];
          this.ctx.lineWidth = 1.0/this.scale.x;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, 0.1, 0, Math.PI*2, true);
          this.ctx.closePath();
          this.ctx.fill();

      }

      //  draw hex outline
      this.ctx.strokeStyle = darworms.dwsettings.cellBackground[1-darworms.dwsettings.backGroundTheme];
      this.ctx.beginPath();
      this.ctx.moveTo(darworms.graphics.vertex_x[0],darworms.graphics.vertex_y[0]);
      for (var j = 1; j < 6 ; j = j + 1) {
          this.ctx.lineTo(darworms.graphics.vertex_x[j], darworms.graphics.vertex_y[j]);
      }
      this.ctx.lineTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
      this.ctx.stroke();
      this.ctx.closePath();


      var outvec = this.grid.outVectorsAt(gPoint);
      var invec = this.grid.inVectorsAt(gPoint);
      // console.log (" drawCell at" +  gPoint.format() + " outVectors 0x" + outvec.toString(16) + " inVectors 0x" + invec.toString(16));

      for (var i = 0; i < 6 ; i = i + 1) {
          if ((outvec & darworms.outMask[i]) !== 0) {
              var outSpokeColor = darworms.dwsettings.colorTable[this.grid.spokeAt(gPoint, i)];
              // console.log (" outSpokeColor " + i + " :  " + outSpokeColor + " at "  + gPoint.format());
              this.ctx.strokeStyle  = outSpokeColor;
              this.ctx.lineWidth =   3.0/this.scale.x ;
              this.ctx.lineCap = 'round';
              this.ctx.beginPath();
              this.ctx.moveTo(0,0);
              this.ctx.lineTo(darworms.graphics.xPts[i], darworms.graphics.yPts[i]);
              this.ctx.stroke();
              this.ctx.closePath();
          }
          if ((invec & darworms.outMask[i]) !== 0) {
              var inSpokeColor = darworms.dwsettings.colorTable[this.grid.spokeAt(gPoint, i)];
              // console.log (" inSpokeColor " + i + " :  " + inSpokeColor + " at "  + gPoint.format());
              this.ctx.strokeStyle  = inSpokeColor;
              this.ctx.lineWidth = 3.0/this.scale.x;
              this.ctx.lineCap = 'round';
              this.ctx.beginPath();
              this.ctx.moveTo(darworms.graphics.xPts[i], darworms.graphics.yPts[i]);
              this.ctx.lineTo(0,0);
              this.ctx.stroke();
              this.ctx.closePath();
          }
      }
  };
  /*  End of wPane */

  /**
   * Created with JetBrains WebStorm.
   * User: dmaynard
   * Date: 9/22/13
   * Time: 12:15 AM
   * To change this template use File | Settings | File Templates.
   */
  /*    gameModule
     Anonymous function that returns Game Object
     to be used as
     var gameObject - new darworms.gameModule.Game()
   *     */
  darworms.gameModule = (function() {
    var gameCanvas;
    var wGraphics;
    var nextToMove;
    var focusPoint;
    var focusWorm;
    var focusValue;
    var scorectx;
    var cellsInZoomPane = new Point(7, 7);


    function Game(gridWidth, gridHeight) {


      darworms.main.wCanvas.width = darworms.wCanvasPixelDim.x;
      darworms.main.wCanvas.height = darworms.wCanvasPixelDim.y;


      this.gameState = darworms.gameStates.over;
      this.grid = new darworms.gridModule.Grid(gridWidth, gridHeight);
      this.canvas = gameCanvas;

      this.frameTimes = [];
      this.startFrameTimes = [];
      this.dirtyCells = [];
      this.numTurns = 0;
      this.numMoves = 0;
      this.timeInDraw = 0;
      this.activeIndex = 0;
      
      // cellsInZoomPane = new Point(9,9);
      cellsInZoomPane = new Point(gridWidth, gridHeight);

      this.zoomPane = new WPane(this.grid, cellsInZoomPane, new Point(gridWidth >> 1, gridHeight >> 1), document.getElementById("wcanvas"));

      this.scale = new Point(((gameCanvas.width) / (gridWidth + 1.5)), ((gameCanvas.height) / (gridHeight + 1)));
      console.log(" new Game scale set to " + this.scale.format());
      this.origin = new Point(gridWidth >> 1, gridHeight >> 1);
      focusPoint = this.origin;
      this.worms = [];
      this.needsRedraw = true;
      this.avePos = new Point(0, 0);
      // worm index of zero means unclaimed.

      this.xPts = [1.0, 0.5, -0.5, -1.0, -0.5, 0.5];
      this.yPts = [0.0, 1.0, 1.0, 0.0, -1.0, -1.0];

      // variable for animating zoom in to selection UI
      // create back buffer image  for current grid image

      // this should depend on scale factor.  On small screens
      // we cshould set pickDirectionUI to true
      if ((this.scale.x) < 20 || (this.scale.y < 20)) {
        $('#pickDirectionUI').slider().val(1);
        $('#pickDirectionUI').slider("refresh");
        darworms.dwsettings.pickDirectionUI = "1";
      }
      console.log(" Scale: " + this.scale.format());
      this.zoomFrame = 0;
      this.startx = 0;
      this.starty = 0;
      this.endx = 0;
      this.endy = 0;
      this.startscale = 1.0;
      this.endScale = 1.0;
      // three second zoom animation
      this.targetZoomFrames = 60;
      this.asterixSize = 0.2;
      this.bullseyeoffset = new Point(0, 0);
      this.focusWorm = null;

    }

    Game.prototype.reScale = function() {
      this.scale = new Point(((gameCanvas.width) / (gridWidth + 1.5)), ((gameCanvas.height) / (gridHeight + 1)));
    };

    Game.prototype.log = function() {

      console.log(" Game grid size  " + new Point(this.grid.width, this.grid.height).format());
      console.log(" Game Canvas size  " + new Point(gameCanvas.width, gameCanvas.height).format());
      console.log(" Game scale " + this.scale.format());
      for (var i = 0; i < this.worms.length; i = i + 1) {
        console.log(" Game worm " + i + " :  " + this.worms[i].state + " at " + this.worms[i].pos.format() + " value:" + this.grid.hexValueAt(this.worms[i].pos));
        // this.worms[i].log();
        // console.log ( "   Grid value =  ");
        // this.grid.logValueAt(this.worms[i].pos);
      }
    };
    Game.prototype.printNonEmpty = function() {

      this.grid.each(function(point, value) {
        if (value > 0) {
          console.log("NonEmpty " + point.format() + " value: 0x" + value.toString(16));
        }
      });

    };

    Game.prototype.getOffset = function(point) {
      var xoff;
      var yoff;
      if ((point.y & 1) === 0) {
        xoff = ((point.x + 0.5) * (this.scale.x)) + (this.scale.x / 2);
      } else {
        xoff = ((point.x + 1.0) * (this.scale.x)) + (this.scale.x / 2);
      }
      yoff = ((point.y + 0.5) * (this.scale.y)) + (this.scale.y / 2);
      return new Point(xoff, yoff);
    };

    Game.prototype.gsetTranslate = function(point) {
      var cellOffset = this.getOffset(point);
      wGraphics.setTransform(this.scale.x, 0, 0, this.scale.y, cellOffset.x, cellOffset.y);
      // console.log( "Drawing cell " +  point.format() + " x= " + cellOffset.x + "  y= " + cellOffset.y);
    };
    Game.prototype.highlightWorm = function(worm, index) {
      if (worm.state === darworms.gameStates.waiting) {
        this.gsetTranslate(worm.pos);

        wGraphics.fillStyle = darworms.dwsettings.cellBackground[darworms.dwsettings.backGroundTheme];
        wGraphics.beginPath();
        wGraphics.arc(0, 0, 0.2, 0, Math.PI * 2, true);
        wGraphics.closePath();
        wGraphics.fill();

        wGraphics.fillStyle = darworms.dwsettings.alphaColorTable[worm.colorIndex];
        wGraphics.beginPath();
        wGraphics.arc(0, 0, 0.2 * ((darworms.graphics.animFrame & 0x1F) / 0x1F), 0, Math.PI * 2, true);
        wGraphics.closePath();
        wGraphics.fill();

      }
    };
    /*  TODO  move all drawing from game to wPanes
     *   except that the Selection wants the cell centered
     */
    Game.prototype.drawCell = function(point) {
      // if (point.isEqualTo(new Point (this.grid.width-1, this.grid.height/2))) {
      //     console.log(this.grid.formatStateAt(point));
      // }
      this.timeInDraw -= Date.now();
      // wGraphics.save();
      this.gsetTranslate(point);
      var owner = this.grid.spokeAt(point, 7);
      wGraphics.lineWidth = 2.0 / this.scale.x;
      //  first clear cell to prevent multiple cals to drawcell from
      // darkening the cell  (multiple calls to the same cell are made to
      // highlite worm positions and animate death.
      // perhaps we should add a parameter to the call indicating whether clear is needsReDraw

      wGraphics.strokeStyle = darworms.dwsettings.colorTable[owner & 0xF];
      wGraphics.fillStyle =
        darworms.dwsettings.cellBackground[darworms.dwsettings.backGroundTheme];

      wGraphics.beginPath();
      wGraphics.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
      for (var j = 1; j < 6; j = j + 1) {
        wGraphics.lineTo(darworms.graphics.vertex_x[j], darworms.graphics.vertex_y[j]);
      }
      // wGraphics.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
      wGraphics.stroke();

      wGraphics.closePath();
      wGraphics.fill();
      // wGraphics.stroke();

      if (owner) {
        wGraphics.strokeStyle = darworms.dwsettings.colorTable[owner & 0xF];
        wGraphics.fillStyle =
          darworms.dwsettings.alphaColorTable[owner & 0xF];
        wGraphics.beginPath();
        wGraphics.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
        for (var j = 1; j < 6; j = j + 1) {
          wGraphics.lineTo(darworms.graphics.vertex_x[j], darworms.graphics.vertex_y[j]);
        }
        // wGraphics.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
        wGraphics.stroke();
        wGraphics.closePath();
        wGraphics.fill();
      }

      // wGraphics.stroke();



      wGraphics.fillStyle = darworms.dwsettings.alphaColorTable[this.grid.spokeAt(point, 6) & 0xF];


      // wGraphics.fillStyle =  darworms.dwsettings.cellBackground[1-darworms.dwsettings.backGroundTheme];
      wGraphics.lineWidth = 2.0 / this.scale.x;
      wGraphics.beginPath();
      wGraphics.arc(0, 0, 0.1, 0, Math.PI * 2, true);
      wGraphics.closePath();
      wGraphics.fill();
      //  draw hex outline
      wGraphics.strokeStyle = darworms.dwsettings.cellBackground[1 - darworms.dwsettings.backGroundTheme];
      wGraphics.lineWidth = 1.0 / this.scale.x;
      wGraphics.beginPath();
      wGraphics.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
      for (var j = 1; j < 6; j = j + 1) {
        wGraphics.lineTo(darworms.graphics.vertex_x[j], darworms.graphics.vertex_y[j]);
      }
      wGraphics.lineTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
      wGraphics.stroke();
      wGraphics.closePath();

      var outvec = this.grid.outVectorsAt(point);
      var invec = this.grid.inVectorsAt(point);
      // console.log (" drawCell at" +  point.format() + " outVectors 0x" + outvec.toString(16) + " inVectors 0x" + invec.toString(16));

      for (var i = 0; i < 6; i = i + 1) {
        if ((outvec & darworms.outMask[i]) !== 0) {
          var outSpokeColor = darworms.dwsettings.colorTable[this.grid.spokeAt(point, i)];
          // console.log (" outSpokeColor " + i + " :  " + outSpokeColor + " at "  + point.format());
          wGraphics.strokeStyle = outSpokeColor;
          wGraphics.lineWidth = 2.0 / this.scale.x;
          wGraphics.lineCap = 'round';
          wGraphics.beginPath();
          wGraphics.moveTo(0, 0);
          wGraphics.lineTo(this.xPts[i], this.yPts[i]);
          wGraphics.stroke();
          wGraphics.closePath();
        }
        if ((invec & darworms.outMask[i]) !== 0) {
          wGraphics.strokeStyle = darworms.dwsettings.colorTable[this.grid.spokeAt(point, i)];
          wGraphics.lineWidth = 2.0 / this.scale.x;
          wGraphics.lineCap = 'round';
          wGraphics.beginPath();
          wGraphics.moveTo(this.xPts[i], this.yPts[i]);
          wGraphics.lineTo(0, 0);
          wGraphics.stroke();
          wGraphics.closePath();
        }
      }
      if (this.grid.isSink(point)) {
        wGraphics.strokeStyle = darworms.dwsettings.colorTable[0];
        for (var k = 0; k < 3; k = k + 1) {
          var m = ((k + 3) % 6);
          wGraphics.beginPath();
          wGraphics.moveTo(this.xPts[k] * this.asterixSize, this.yPts[k] * this.asterixSize);
          wGraphics.lineTo(this.xPts[m] * this.asterixSize, this.yPts[m] * this.asterixSize);
          wGraphics.stroke();
          wGraphics.closePath();
          wGraphics.lineTo(darworms.graphics.vertex_x[j], darworms.graphics.vertex_y[j]);
        }
      }
      // wGraphics.restore();
      this.timeInDraw += Date.now();

    };

    Game.prototype.drawPickCell = function(point, activeColor) {
      // wGraphics.save();
      darworms.theGame.gsetTranslate(point);
      wGraphics.fillStyle = darworms.dwsettings.cellBackground[darworms.dwsettings.backGroundTheme];
      // wGraphics.fillRect(-0.5, -0.5, 1.0, 1.0);
      var owner = this.grid.spokeAt(point, 7);
      if (owner !== 0) {
        console.log(" Why is an owned cell a target selection? " + point.format(point));
      }
      this.drawCell(point); // set up original background for this cell

      var animFraction = 1.0 * (darworms.graphics.animFrame & 0x3F) / 64;

      wGraphics.strokeStyle = activeColor;
      wGraphics.fillStyle = activeColor;
      wGraphics.beginPath();
      wGraphics.moveTo(darworms.graphics.vertex_x[0] * animFraction, darworms.graphics.vertex_y[0] * animFraction);
      for (var j = 1; j < 6; j = j + 1) {
        wGraphics.lineTo(darworms.graphics.vertex_x[j] * animFraction, darworms.graphics.vertex_y[j] * animFraction);
      }
      wGraphics.moveTo(darworms.graphics.vertex_x[0], darworms.graphics.vertex_y[0]);
      wGraphics.stroke();
      wGraphics.closePath();
      wGraphics.fill();
      // wGraphics.stroke();



      wGraphics.fillStyle = darworms.dwsettings.alphaColorTable[this.grid.spokeAt(point, 6) & 0xF];
    };
    Game.prototype.drawPickCellOrigin = function(point, activeColor) {
      // wGraphics.save();
      darworms.theGame.gsetTranslate(point);
      wGraphics.fillStyle = darworms.dwsettings.cellBackground[darworms.dwsettings.backGroundTheme];
      // wGraphics.fillRect(-0.5, -0.5, 1.0, 1.0);
      var owner = this.grid.spokeAt(point, 7);
      if (owner !== 0) {
        console.log(" Why is an owned cell a target selection origin? " + point.format(point));
      }
      this.drawCell(point); // set up original backgrounf for this cell

      var animFraction = 1.0 * (darworms.graphics.animFrame & 0x3F) / 64;

      wGraphics.strokeStyle = activeColor;
      wGraphics.fillStyle = activeColor;
      var outvec = this.grid.outVectorsAt(point);
      var invec = this.grid.inVectorsAt(point);
      for (var dir = 0; dir < 6; dir = dir + 1) {
        if (((outvec & darworms.outMask[dir]) == 0) && ((invec & darworms.outMask[dir]) == 0)) {


          wGraphics.lineWidth = 3.0 / this.scale.x;
          wGraphics.lineCap = 'round';
          wGraphics.beginPath();
          wGraphics.moveTo(0, 0);
          wGraphics.lineTo(this.xPts[dir] * animFraction, this.yPts[dir] * animFraction);
          wGraphics.stroke();
          wGraphics.closePath();

        }

      }

    };



    Game.prototype.drawExpandedTarget = function(pickTarget) {
      var screenCoordinates = this.getOffset(pickTarget.pos);

      wGraphics.save();


      fillColorString = darworms.dwsettings.alphaColorTable[pickTarget.wormColorIndex];

      wGraphics.strokeStyle = fillColorString;

      wGraphics.lineWidth = 4;
      wGraphics.setTransform(1.0, 0, 0, 1.0, 0, 0);
      wGraphics.beginPath();
      var xloc = ((this.xPts[pickTarget.dir] * gameCanvas.width * .75) / 2) + (gameCanvas.width / 2);
      var yloc = ((this.yPts[pickTarget.dir] * gameCanvas.height * .75) / 2) + (gameCanvas.height / 2);

      wGraphics.arc(xloc, yloc, 20, 0, Math.PI * 2, false);
      wGraphics.closePath();
      wGraphics.stroke();

      wGraphics.strokeStyle = fillColorString;
      wGraphics.lineWidth = 2;
      wGraphics.moveTo(xloc, yloc);
      wGraphics.beginPath();
      wGraphics.moveTo(xloc, yloc);
      var animFraction = 1.0 * (darworms.graphics.animFrame & 0x7F) / 128;
      wGraphics.lineTo(
        (xloc + ((screenCoordinates.x - xloc) * animFraction)),
        (yloc + ((screenCoordinates.y - yloc) * animFraction)));

      wGraphics.closePath();
      wGraphics.stroke();
      wGraphics.restore();
    };
    Game.prototype.drawPickCells = function() {
      var animFraction = 1.0 * (darworms.graphics.animFrame & 0x7F) / 128;
      if ((darworms.dwsettings.pickDirectionUI == 1) && (animFraction < 0.1)) {
        darworms.theGame.clearCanvas();
        darworms.theGame.drawCells(); // shound use backbuffer instead of redrawing?
      }
      darworms.pickCells.forEach(function(pickTarget) {
        darworms.theGame.drawPickCell(pickTarget.pos, pickTarget.color);
      });
      darworms.theGame.drawPickCellOrigin(focusWorm.pos,
        darworms.dwsettings.alphaColorTable[focusWorm.colorIndex]);

      if (darworms.dwsettings.pickDirectionUI == 1) {
        darworms.pickCells.forEach(function(pickTarget) {
          darworms.theGame.drawExpandedTarget(pickTarget);
        });
      }

      this.worms.forEach(function(worm, index) {
        darworms.theGame.highlightWorm(worm, index);
      }, darworms.theGame);
    };
    Game.prototype.drawSelectCell = function(recenter) {
      //  Draw the large direction selectors screen
      //  A rectangle 2.0 x 2.0
      if (recenter) {
        darworms.theGame.drawZoom();
      }
      wGraphics.save();
      //    console.log( "drawSelectCell  canvas "  + gameCanvas.width + " height "  + gameCanvas.height);
      //    console.log( "drawSelectCell  grid "  + this.grid.width + " height "  + this.grid.height);
      //   setting this transform may not need to be done every anim frame
      //  it only changes on zoom in or zoom out I think
      var hoffset = -this.zoomPane.scale.x / 4;
      var voffset = 0;
      if ((focusPoint.y & 1) === 1 && (cellsInZoomPane.x > 1)) {
        hoffset = this.zoomPane.scale.x / 4;
        // console.log( "drawSelectCell  hoffset "  + hoffset);
      }
      if ((this.zoomPane.cHeight & 1) != 1) {
        hoffset += this.zoomPane.scale.x / 2;
        voffset += this.zoomPane.scale.y / 2;
      }
      this.bullseyeoffset = new Point(hoffset, voffset);
      // console.log( "drawSelectCell  hoffset "  + hoffset + " scale.x = " + this.zoomPane.scale.x);
      wGraphics.setTransform((gameCanvas.width - (this.scale.x / 2)) / 2, 0, 0, (gameCanvas.height - (this.scale.y / 2)) / 2,
        (gameCanvas.width / 2) + hoffset, (gameCanvas.height) / 2 + voffset);

      if ((darworms.graphics.animFrame % 0xFF) == 0) {
        console.log(" drawSelectCell  hoffset " + hoffset);
        console.log(" drawSelectCell  voffset " + voffset);
        console.log("  drawSelectCell pixel center is " + new Point((gameCanvas.width / 2) + hoffset, (gameCanvas.height) / 2 + voffset).format());
      }

      var owner = this.grid.spokeAt(focusPoint, 7);
      wGraphics.fillStyle = "rgba(0,0,0,0.8)";
      wGraphics.beginPath();
      wGraphics.arc(0, 0, 0.3 / darworms.theGame.zoomPane.cWidth, 0, Math.PI * 2, true);
      wGraphics.closePath();
      wGraphics.fill();

      var outvec = this.grid.stateAt(focusPoint);
      for (var i = 0; i < 6; i = i + 1) {
        if ((outvec & darworms.outMask[i]) !== 0) {
          var outSpokeColor = darworms.dwsettings.alphaColorTable[this.grid.spokeAt(focusPoint, i)];
          // console.log (" outSpokeColor " + i + " :  " + outSpokeColor + " at "  + focusPoint.format());
          // wGraphics.strokeStyle  = "rgba(0,0,0,0.2)";
          wGraphics.strokeStyle = outSpokeColor;
          wGraphics.lineWidth = 8 / gameCanvas.width;
          wGraphics.lineCap = 'round';
          wGraphics.beginPath();
          wGraphics.moveTo(0, 0);
          wGraphics.lineTo(this.xPts[i] / cellsInZoomPane.x * 2.0, this.yPts[i] / cellsInZoomPane.y * 2.0);
          wGraphics.stroke();
          wGraphics.closePath();
        } else {

          wGraphics.strokeStyle = darworms.dwsettings.alphaColorTable[focusWorm.colorIndex];
          wGraphics.lineWidth = 8 / gameCanvas.width;
          // wGraphics.moveTo(this.targetPts[i].x, this.targetPts[i].y);
          wGraphics.beginPath();
          wGraphics.arc(this.xPts[i] * .75, this.yPts[i] * .75, (0.250 / 64) * (darworms.graphics.animFrame & 0x3F), 0, Math.PI * 2, false);
          wGraphics.closePath();
          wGraphics.stroke();
          wGraphics.moveTo(0, 0);
          wGraphics.lineTo((this.xPts[i] * .75) / 64.0 * (darworms.graphics.animFrame & 0x3F),
            (this.yPts[i] * .75) / 64.0 * (darworms.graphics.animFrame & 0x3F));
          wGraphics.stroke();
          wGraphics.closePath();
        }
      }
      wGraphics.restore();
      this.needsReDraw = true;

    };

    Game.prototype.drawCells = function() {
      wGraphics.save();
      for (var col = 0; col < this.grid.width; col = col + 1) {
        for (var row = 0; row < this.grid.height; row = row + 1) {
          this.drawCell(new Point(col, row));
        }
      }
      wGraphics.restore();
    };
    Game.prototype.drawDirtyCells = function() {
      var pt;
      // wGraphics.save();
      while ((pt = this.dirtyCells.pop()) !== undefined) {
        this.drawCell(pt);
      }
      // wGraphics.restore();
    };

    Game.prototype.animateDyingWorms = function() {
      for (var i = 0; i < 4; i = i + 1) {
        // We don't want to do the animates in the same order ever frame because
        // when tow worms die together the second's animations would always overwite
        // the first's/

        var whichWorm = ((i + darworms.graphics.uiFrames) & 0x3);
        if (this.worms[whichWorm].state == wormStates.dying) {
          this.animateDyingCell(this.worms[whichWorm]);
        }
      }
    };


    Game.prototype.animateDyingCell = function(worm) {
      this.drawCell(worm.pos);
      this.drawShrikingOutline(worm);
    };
    Game.prototype.drawShrikingOutline = function(worm) {
      var animFraction = (darworms.graphics.dyningAnimationFrames - (darworms.graphics.uiFrames - worm.diedAtFrame)) /
        darworms.graphics.dyningAnimationFrames;
      darworms.theGame.gsetTranslate(worm.pos);

      wGraphics.strokeStyle = darworms.dwsettings.alphaColorTable[worm.colorIndex];
      wGraphics.lineWidth = .1;
      wGraphics.fillStyle = darworms.dwsettings.alphaColorTable[worm.colorIndex];
      wGraphics.beginPath();
      wGraphics.moveTo(darworms.graphics.vertex_x[0] * animFraction, darworms.graphics.vertex_y[0] * animFraction);
      for (var j = 1; j < 6; j = j + 1) {
        wGraphics.lineTo(darworms.graphics.vertex_x[j] * animFraction, darworms.graphics.vertex_y[j] * animFraction);
      }
      wGraphics.lineTo(darworms.graphics.vertex_x[0] * animFraction, darworms.graphics.vertex_y[0] * animFraction);
      //wGraphics.stroke();
      wGraphics.closePath();
      wGraphics.stroke();
      //wGraphics.fill();
      // wGraphics.stroke();
    };

    Game.prototype.clearCanvas = function() {
      // Store the current transformation matrix
      wGraphics.save();

      // Use the identity matrix while clearing the canvas
      wGraphics.setTransform(1, 0, 0, 1, 0, 0);
      wGraphics.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      wGraphics.fillStyle = darworms.dwsettings.cellBackground[darworms.dwsettings.backGroundTheme];
      wGraphics.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

      // Restore the transform
      wGraphics.restore();
      //    wGraphics.clearRect(0,0,canvas.width,canvas.height);
    };


    Game.prototype.initGame = function() {
      this.clearCanvas();
      this.grid.clear();
      this.elapsedTime = -new Date().getTime();
      this.frameTimes.length = 0;
      this.startFrameTimes.length = 0;
      this.numMoves = 0;
      this.numTurns = 0;
      this.timeInDraw = 0;

    };
    Game.prototype.addWorm = function(w) {
      w.pos = this.origin;
      w.nMoves = 0;
      w.score = 0;
      w.state = wormStates.paused;
      this.worms.push(w);
    };
    Game.prototype.getAvePos = function(w) {
      var nActiveAve = 0;
      this.avePos.x = 0;
      this.avePos.y = 0;

      for (var i = 0; i < this.worms.length; i = i + 1) {
        var active = this.worms[i];
        if (active.state === wormStates.moving) {
          this.avePos.x = this.avePos.x + active.pos.x;
          this.avePos.y = this.avePos.y + active.pos.y;
          nActiveAve = nActiveAve + 1;
        }
      }

      if (nActiveAve > 1) {
        this.avePos.x = Math.floor(this.avePos.x / nActiveAve);
        this.avePos.y = Math.floor(this.avePos.y / nActiveAve);
      }
      // console.log(this.avePos.format());
    };
    Game.prototype.drawZoom = function() {
      //   console.log (" drawZoom   "  + " at "  + aPos.format());
      this.zoomPane.setCenter(focusPoint, cellsInZoomPane);
      this.zoomPane.drawCells();
    };
    Game.prototype.makeMove = function(graphicsOn) {
      var nAlive = 0;
      if (this.gameState === darworms.gameStates.waiting) {
        return;
      }
      // console.log ("Game  StartingTurn " + this.numTurns );
      for (var i = nextToMove; i < this.worms.length; i = i + 1) {
        var active = this.worms[i];
        darworms.theGame.activeIndex = i;
        // console.log (" GamemakeMove   for worm" + i + " :  " + wormStateNames[active.state] + " at "  + active.pos.format());
        if (active.state === wormStates.sleeping) {
          continue;
        }
        // active.state = wormStates.moving;
        // console.log (" Game  Before Move for worm" + i + " :  " + active.state + " at "  + active.pos.format());
        // active.log();
        // console.log ( "   Grid value =  ");
        // this.grid.logValueAt(active.pos);
        var currentState = this.grid.stateAt(active.pos);
        // console.log (" Current State = " + currentState);
        if (currentState == 0x3F) {
          // last sample is death sound
          if ((active.state != (wormStates.dead) && (active.state != wormStates.dying))) {
            if (darworms.dwsettings.doAnimations) {
              if ((darworms.dwsettings.doAudio == 1) && darworms.audioSamples[darworms.audioSamples.length - 1]) {
                darworms.audioSamples[darworms.audioSamples.length - 1].playSample(1.0, 0.0);
              }
            }
            active.state = (darworms.dwsettings.doAnimations)? wormStates.dying : wormStates.dead;
            active.diedAtFrame = darworms.graphics.uiFrames;
            console.log(" darworm " + active.colorIndex + " dying at frame: " + darworms.graphics.animFrame);
          }

        if (active.state == wormStates.dying) {
          if ((darworms.graphics.uiFrames - active.diedAtFrame) > darworms.graphics.dyningAnimationFrames) {
            active.state = wormStates.dead;
            console.log(" darworm " + active.colorIndex + " dead at frame: " + darworms.graphics.animFrame);
          }
        }

      } else {
        var direction = active.getMoveDir(currentState);
        if (direction === darworms.dwsettings.codons.unSet) {
          this.gameState = darworms.graphics.enableTransitionStates ?
            darworms.gameStates.animToUI : darworms.gameStates.waiting;
          // console.log(this.grid.formatStateAt(active.pos));
          if (this.gameState === darworms.gameStates.animToUI) {
            this.initPanZoom(active);
          }

          console.log(" setting gamestate to  " + this.gameState);
          focusPoint = active.pos;
          focusWorm = active;
          darworms.theGame.focusWorm = active;
          focusValue = currentState;
          if (darworms.theGame.focusWorm.showTutorial) {
            $("input[type='checkbox']").attr("checked",false);
            var themes = ["c", "d", "e", "f"];
            // ToDo  set proper theme for popup   red green blue ye
            // Setter
            // $('#tutorialpopup' ).popup( "option", "overlayTheme", "d" );
            $('#tutorialpopup').popup( "option", "theme", themes[darworms.theGame.activeIndex] );
            $('#tutorialpopup').popup("open");
          }
          nextToMove = i;
          this.numMoves = this.numMoves + 1;
          active.nMoves = active.nMoves + 1;
          this.zoomPane.canvasIsDirty = true;
          this.drawDirtyCells();
          if (darworms.dwsettings.panToSelectionUI == 0) {
            this.initPickUI(active);
          }
          return (true);
        }
        {
          this.dirtyCells.push(active.pos);

        }
        // console.log (" Move Direction = " + direction);
        var next = this.grid.next(active.pos, direction);
        if (next.isEqualTo(darworms.dwsettings.noWhere)) { // fell of edge of world
          active.state = wormStates.dead;
          active.died = true;
        } else {
          var didScore = this.grid.move(active.pos, next, direction, active.colorIndex);
          active.score = active.score + didScore;
          this.numMoves = this.numMoves + 1;
          active.nMoves = active.nMoves + 1;
          // console.log("    Worm " + active.colorIndex + "  just made move " + active.nMoves + " game turn " + this.numTurns + " From " + this.grid.formatStateAt(active.pos) + " direction  " + direction);
          active.pos = next;

          {
            this.dirtyCells.push(next);
            if (darworms.dwsettings.doAudio == 1  && graphicsOn) {
              if ((active.audioSamplesPtrs[direction] !== undefined) && (active.audioSamplesPtrs[direction] >= 0)) {
                darworms.audioSamples[active.audioSamplesPtrs[direction]].
                playSample(
                  darworms.audioPlaybackRates[active.MusicScale[(didScore == 1) ? 6 : direction]],
                  (active.pos.x - (darworms.theGame.grid.width / 2)) / (darworms.theGame.grid.width / 2));
              }
            }

          }

          // console.log(" active.score [" +  i + "] ="  + active.score);

          //console.log("     From Value is " +  this.grid.hexValueAt(active.pos)  );
          //console.log (" Next Point = " + next.format());
          //console.log(" Set To State to " +  this.grid.stateAt(active.pos)  );
          //console.log("     To Value is " +  this.grid.hexValueAt(active.pos)  );
        }

      }
      if ((active.state !== wormStates.dead)) {
        nAlive = nAlive + 1;
      }
      //console.log (" Game  After Move for worm" + i + " :  " + active.state + " at "  + active.pos.format());
      // this.grid.logValueAt(active.pos);
    }
    nextToMove = 0;
    this.numTurns = this.numTurns + 1;
    return (nAlive > 0 || (nextToMove !== 0));
  };

  Game.prototype.initPickUI = function(worm) {

    console.log(" initPickUI");
    darworms.pickCells = new Array();
    var outvec = this.grid.outVectorsAt(worm.pos);
    var inVec = this.grid.inVectorsAt(worm.pos);
    // console.log (" drawCell at" +  point.format() + " outVectors 0x" + outvec.toString(16) + " inVectors 0x" + invec.toString(16));

    for (var dir = 0; dir < 6; dir = dir + 1) {
      if (((outvec & darworms.outMask[dir]) == 0) && ((inVec & darworms.outMask[dir]) == 0)) {
        var pickTarget = {};
        pickTarget.pos = this.grid.next(worm.pos, dir);
        pickTarget.dir = dir;
        pickTarget.color = darworms.dwsettings.alphaColorTable[focusWorm.colorIndex];
        pickTarget.wormColorIndex = focusWorm.colorIndex;
        darworms.pickCells.push(pickTarget);
      }
    }
  };

  Game.prototype.showTimes = function() {
    var min = 100000000;
    var max = 0;
    var ave = 0;
    var nFrames = 0;
    var sumTime = 0;
    var fps = 0;
    console.log("this.frameTimes.length " + this.frameTimes.length);
    for (var i = 0; i < this.frameTimes.length; i = i + 1) {
      nFrames = nFrames + 1;
      if (this.frameTimes[i] > max) {
        max = this.frameTimes[i];
      }
      if (this.frameTimes[i] < min) {
        min = this.frameTimes[i];
      }
      sumTime = sumTime + this.frameTimes[i];
    }
    if (nFrames > 0) {
      ave = Math.round(sumTime / nFrames * 100) / 100;
    }
    var totalElapsed = new Date().getTime() - this.startFrameTimes[0];
    var percentDrawing = Math.round((sumTime * 100 / totalElapsed * 100)) / 100;
    // var percentDrawing = (sumTime * 100 / totalElapsed);

    if (this.elapsedTime > 0) {
      fps = Math.round(nFrames * 1000 / this.elapsedTime * 100) / 100;
    }
    document.getElementById('wormframes').innerHTML = nFrames;
    document.getElementById('wormmintime').innerHTML = min;
    document.getElementById('wormmaxtime').innerHTML = max;
    document.getElementById('wormavetime').innerHTML = ave;
    document.getElementById('wormframetargettime').innerHTML = 1000 / $("#fps").val();

    document.getElementById('wormfps').innerHTML = fps;
    //  frame Intervals.  How often did out update get called
    min = 1000000;
    max = 0;
    nFrames = 0;
    sumTime = 0;
    ave = 0;
    var delta = 0;
    for (i = 1; i < this.startFrameTimes.length; i = i + 1) {
      nFrames = nFrames + 1;
      delta = this.startFrameTimes[i] - this.startFrameTimes[i - 1];
      if (delta > max) {
        max = delta;
      }
      if (delta < min) {
        min = delta;
      }
      sumTime = sumTime + delta;
    }
    if (nFrames > 0) {
      ave = Math.round(sumTime / nFrames * 100) / 100;
    }
    document.getElementById('wormframemintime').innerHTML = min;
    document.getElementById('wormframemaxtime').innerHTML = max;
    document.getElementById('wormframeavetime').innerHTML = ave;
    document.getElementById('wormframepercenttime').innerHTML = percentDrawing;
    document.getElementById('wormframetotaltime').innerHTML = this.timeInDraw / 1000;


  };

  Game.prototype.initPanZoom = function(activeWorm) {
    //  save a copy of the current grid canvas
    // to act as a backgroud for the selection UI

    var coffset = this.getOffset(activeWorm.pos);

    this.gridImage = this.convertCanvasToImage(darworms.main.wCanvas);
    this.zoomFrame = 0;
    this.startx = 0;
    this.starty = 0;
    this.endx = (darworms.main.wCanvas.width / 2) - coffset.x;

    var hoffset = -this.zoomPane.scale.x / 4;

    if ((activeWorm.pos.y & 1) === 1 && (cellsInZoomPane.x > 1)) {
      hoffset = this.zoomPane.scale.x / 4;
      // console.log( "drawSelectCell  hoffset "  + hoffset);
    }

    this.endx = (darworms.main.wCanvas.width / 2) + hoffset - coffset.x;

    this.endy = (gameCanvas.height) / 2 - coffset.y;
    this.startScale = 1.0;
    this.endScale = 4.0;
    // three second zoom animation
    this.targetZoomFrames = 120;
    console.log(" Worm pos =" + activeWorm.pos.format());
    console.log(" end anim = " + new Point(this.endx, this.endy).format());
  };

  Game.prototype.animIn = function(gameState) {
    if (darworms.theGame.gameState == darworms.gameStates.animToUI) {
      this.zoomFrame++;
    }
    if (darworms.theGame.gameState == darworms.gameStates.animFromUI) {
      this.zoomFrame--;
      this.zoomFrame--;
      this.zoomFrame--;
      this.zoomFrame--;


    }

    if (this.zoomFrame >= this.targetZoomFrames) {
      //  go to waiting for UI input state
      this.gameState = darworms.gameStates.waiting;
      console.log("     animIn " + this.zoomFrame + "   xoffset=" + xoffset + "  yoffset = " + yoffset + " scale = " + scl);
    }
    if (this.zoomFrame <= 0) {
      //  go to waiting for UI input state
      this.gameState = darworms.gameStates.running;
      console.log("     animIn " + this.zoomFrame + "   xoffset=" + xoffset + "  yoffset = " + yoffset + " scale = " + scl);
    }
    var xoffset = this.startx - (this.endx - this.startx) * this.zoomFrame / this.targetZoomFrames;
    var yoffset = this.starty - (this.endy - this.starty) * this.zoomFrame / this.targetZoomFrames;
    var scl = this.startScale + (this.endScale - this.startScale) * this.zoomFrame / this.targetZoomFrames;
    wGraphics.save();
    this.clearCanvas();
    wGraphics.setTransform(1, 0, 0, 1, 0, 0);
    wGraphics.drawImage(this.gridImage, xoffset, yoffset, darworms.main.wCanvas.width, darworms.main.wCanvas.height,
      0, 0, darworms.main.wCanvas.width, darworms.main.wCanvas.height);
    wGraphics.restore();

  };

  // Converts canvas to an image
  Game.prototype.convertCanvasToImage = function(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  };


  var reScale = function(gridWidth, gridHeight) {
    this.scale = new Point(((gameCanvas.width) / (gridWidth + 1.5)), ((gameCanvas.height) / (gridHeight + 1)));
    console.log(" reScaled to " + this.scale.format());
  };

  // end of Module prototypes

  //  Called from Timer Loop

  var clearScore = function(segmentIndex, totalSegments) {
    var segWidth = darworms.dwsettings.scoreCanvas.width / totalSegments;
    scorectx.fillStyle = "rgba(222,222,222, 1.0)";
    scorectx.shadowOffsetX = 0;
    scorectx.shadowOffsetY = 0;

    scorectx.fillRect(segWidth * segmentIndex, 0, segWidth, darworms.dwsettings.scoreCanvas.height);
  };
  var scoreStartx = function(segmentIndex, totalSegments, text) {
    var segWidth = darworms.dwsettings.scoreCanvas.width / totalSegments;
    var twidth = scorectx.measureText(text).width;
    return ((segWidth * segmentIndex) + (segWidth / 2) - (twidth / 2));

  };
  var updateScores = function() {
    var i;
    for (i = 0; i < 4; i++) {
      if (darworms.theGame.worms[i] !== undefined && darworms.theGame.worms[i].shouldDrawScore()) {
        clearScore(i, 4);
        scorectx.fillStyle = darworms.dwsettings.colorTable[i + 1];
        // scorectx.shadowOffsetX = 3;
        // scorectx.shadowOffsetY = 3;
        scorectx.fillText(darworms.theGame.worms[i].score, scoreStartx(i, 4, darworms.theGame.worms[i].score.toString()), 15);
      }
    }
  };
  var makeMoves = function() {
    // console.log(" makeMoves theGameOver " + theGameOver +  "  gameState " + gameStateNames[theGame.gameState] );
    var startTime = new Date().getTime();
    darworms.theGame.startFrameTimes.push(startTime);
    if (darworms.theGame.needsRedraw) {
      darworms.theGame.drawCells();
      darworms.theGame.needsRedraw = false;
      // wGraphics.drawImage(localImage, 10, 10);

    }
    if (darworms.theGame.gameState != darworms.gameStates.over) {
      if (darworms.theGame.makeMove(darworms.dwsettings.doAnimations) === false) {
        darworms.theGame.elapsedTime = darworms.theGame.elapsedTime + new Date().getTime();
        console.log(" Game Over");
        clearInterval(darworms.graphics.timer);
        // document.getElementById("startpause").innerHTML = "Start Game";
        $("#startpause").text("Start Game");
        darworms.theGame.showTimes();
        updateScores();
        darworms.theGame.gameState = darworms.gameStates.over;

      }
    }
    darworms.theGame.drawDirtyCells();
    darworms.theGame.animateDyingWorms();
    darworms.theGame.getAvePos();
    updateScores();
    var elapsed = new Date().getTime() - startTime;
    darworms.theGame.frameTimes.push(elapsed);
  };
  // Called from user actions
  var selectDirection = function(point) {
    ((darworms.dwsettings.panToSelectionUI == 1) || (darworms.dwsettings.pickDirectionUI == 1)) ? selectLargeUIDirection(point):
      selectSmallUIDirection(point);
  };

  var selectSmallUIDirection = function(touchPoint) {
    // we should be able to bind the forEach to this instead using darworms.theGame
    darworms.pickCells.forEach(function(pickTarget) {
      var screenCoordinates = this.getOffset(pickTarget.pos);
      var absdiff = touchPoint.absDiff(screenCoordinates);
      var diff = new Point(touchPoint.x - screenCoordinates.x, touchPoint.y - screenCoordinates.y);
      if ((absdiff.x < (this.scale.x / 2)) && (absdiff.y < (this.scale.y / 2)) &&
        this.gameState === darworms.gameStates.waiting) {
        console.log(" target hit delta: " + diff.format());
        setDNAandResumeGame(pickTarget.dir);
      }
    }, darworms.theGame);

  };

  var selectLargeUIDirection = function(point) {
    // console.log( "selectDirection: " + point.format());
    var outvec = darworms.theGame.grid.stateAt(focusPoint);
    var minDist = 100000;
    var dist;
    var select = -1;
    for (var i = 0; i < 6; i = i + 1) {
      if ((outvec & darworms.outMask[i]) === 0) {
        target = new Point((darworms.theGame.xPts[i] * .75) * (gameCanvas.clientWidth / 2) +
          darworms.theGame.bullseyeoffset.x + (gameCanvas.clientWidth / 2) + darworms.theGame.zoomPane.pMargin,

          ((darworms.theGame.yPts[i] * .75) * (gameCanvas.clientHeight) / 2) +
          darworms.theGame.bullseyeoffset.y + (gameCanvas.clientHeight) / 2 + darworms.theGame.zoomPane.pMargin);

        // console.log(" direction: " + i + " target point " + target.format());
        // console.log("Touch Point: " + point.format());
        dist = target.dist(point);
        //  Actual pixel coordinates
        if (dist < minDist) {
          minDist = dist;
          select = i;
        }
        // console.log("selectDirection i: " + i + "  dist: " + dist + " Min Dist:" + minDist);
      }
    }
    if ((minDist < gameCanvas.clientWidth / 8) && (select >= 0)) {
      setDNAandResumeGame(select);
    }
  };

  var setDNAandResumeGame = function(direction) {
    focusWorm.dna[focusValue & 0x3F] = direction;
    focusWorm.numChoices += 1;
    //  TODO setState to animFromUI
    darworms.theGame.gameState = darworms.graphics.enableTransitionStates ?
      darworms.gameStates.animFromUI : darworms.gameStates.running;
    darworms.theGame.clearCanvas();
    darworms.theGame.drawCells();
  };
  var doZoomOut = function(tapPoint) {
    if (tapPoint.dist(new Point(0, 1.0)) < 0.2) {
      if (cellsInZoomPane.x > 5) {
        cellsInZoomPane.x = cellsInZoomPane.x - 1;
        cellsInZoomPane.y = cellsInZoomPane.y - 1;
      }
      console.log("doZoomIN: returning true  wPane size =" + cellsInZoomPane.x);
      darworms.theGame.zoomPane.canvasIsDirty = true;
      darworms.theGame.zoomPane.setSize(new Point(cellsInZoomPane.x, cellsInZoomPane.y));
      return true;
    }
    if (tapPoint.dist(new Point(0, -1.0)) < 0.2) {
      if (cellsInZoomPane.x < darworms.theGame.grid.width) {
        cellsInZoomPane.x = cellsInZoomPane.x + 1;
        cellsInZoomPane.y = cellsInZoomPane.y + 1;

        console.log("doZoomOut: returning true  wPane size =" + cellsInZoomPane.x);
        darworms.theGame.zoomPane.canvasIsDirty = true;
        darworms.theGame.zoomPane.setSize(new Point(cellsInZoomPane.x, cellsInZoomPane.y));
        // theGame.drawZoom(theGame.zoomPane.focus, theGame.cellsInZoomPane);
      }
      return true;
    }
    return false;

  };


  function init() {
    // used to initialize variable in this module's closure
    console.log(" darworms.main.wCanvas,width: " + darworms.main.wCanvas.width);
    gameCanvas = darworms.main.wCanvas;
    console.log(" gameCanvas.width " + darworms.main.wCanvas.width);

    wGraphics = darworms.main.wGraphics;
    nextToMove = 0;
    window.scoreCanvas = document.getElementById("scorecanvas");
    scorectx = darworms.dwsettings.scoreCanvas.getContext("2d");
    scorectx.font = "bold 18px sans-serif";
    scorectx.shadowColor = "rgb(190, 190, 190)";
    scorectx.shadowOffsetX = 3;
    scorectx.shadowOffsetY = 3;



  }
  return {
    // these are the public methods for gameModule
    Game: Game,
    init: init,
    reScale: reScale,
    makeMoves: makeMoves,
    selectDirection: selectDirection,
    doZoomOut: doZoomOut,
    updateScores: updateScores
  };

  })(); /* end of Game */

  /*
    <script src="scripts/loader.js"></script>
    <script src="scripts/AudioSample.js"></script>
    <script src="scripts/Point.js"></script>
    <script src="scripts/Grid.js"></script>
    <script src="scripts/Worm.js"></script>
    <script src="scripts/WPane.js"></script>
    <script src="scripts/Game.js"></script>
    <script src="scripts/main.js"></script>
  */

  /*  DarWorms
   Copyright BitBLT Studios inc
   Author: David S. Maynard
   Deployment:
   scp -r -P 12960 ~/projects/SumoWorms/www/*.* dmaynard@bitbltstudios.com:/var/www/darworms/
   git push bitbltstudios:~/repo/ master

   darworms.com

     interesting DarWorms
   EEF?A??FB??F?FF?CC?F?FF???A?FF?FD??E?EE??CE?E??E?DD?D??DB??C?BAX
   DBCDAFEDCEFFEFEEFFADDBADBCFFFFAFBCCCADEDBBAEBBEEABDDABDDCBACABAX
   AEF?AE?DB??F?FF?C??C?FF??FA?FF?FD??C?BE??CA?A??E?B??A??DA??C?BAX
   AEF?AE?EB??F?FF?C??D?FD??BC?B??FD??D?DE??CC?B??E?DA?BD?DB??C?BAX
   AEF?AE?FB??E?FF?C??F?FD??FC?BF?FD??D?EA??CA?A??E?BD?A??DB??C?BAX
   AEF?AB?FB??F?FE?C??C?FA??BA?A??FD??D?EEE?EA?E??E?CA?D??DC??C?BAX
   //  nice   almost perfect worm (316)
   AEF?AE?FB??C?FE?C??D?DF??CA?AF?FD??E?BA??BA?A??E?DD?A??DC??C?BAX
   // perfect
   DFADAFEEFBCEBFEFDDCDBDADCBAFBBAFEDCEBEDEAEECAEAEDDADDBDDBBACABAX

   // perfect and interesting
   FDEDBDAEABFEBEEFCFDFBFFFFBCCBBAFDBEDAEDEACCCBBAEACCCBDADCCCCBBAX

   // nice score  297
   AEF?AF?FB??E?FA?C??F?DD??CA?F??FD??E?BAE?EE?E??E?BD?D??DA??C?BAX

   // 116
   AEF?AE?FB??C?BE?C??F?DD??FA?BF?FD??E??A??CC?B??E?D??D??DC??C?BAX

   //  short  score 10
   //  short score 42
   AEF?AE?FB??C?BE?C??F?DDF??C?B??FD??E??A??EA?B??E?DA?D??DC??C?BAX
  // short score 2
   AEF?AB?FB????B?EC??F?B????C????FD?????E???C????E?D??B??DC??C?BAX
  // nice 30
  AEF?AF?FB????BA?C??F?DA???F?B??FD??E?D?D???????E?D??D??DC??C?BAX



  LOGO Darworm  (score 3)
  DFA?B??FC?????A?D???????C???B??FE??E???????????E?D?????D???CBBAX
  DFA?B??FC?????A?D???????C???B??FE??ED??????????E?D?????DC??CBBAX
  DFA?B?AFC???E?A?D???????CF??B??FE??ED?D??B?????E?D?????DC??CBBAX
  DFA?B?AFC???E?A?D???????CF??B??FE??ED?DE?B?????E?D?????DC??CBBAX
  DFA?B?AFC???E?A?D???????CF??B??FE??ED?D??B?????E?D?????DC??CBBAX
  DFA?B?AFC???E?A?D???????C???B?AFE??EDB?E????B??E?D??B??DC??CBBAX
  DFA?B?AFC???E?A?D???????C???B?AFE??EDB?E?C??B??E?D??B??DC??CBBAX


  // Almost space filling
   FEF?A??FB??C?BA?C??D?DF??BA?B??FD?EE?BA??EE?A??E?DD?D?DDC??C?BAX

   */



  darworms.main = (function() {

    var deviceInfo = function() {
      alert("This is a deviceInfo.");
      document.getElementById("width").innerHTML = screen.width;
      document.getElementById("height").innerHTML = screen.height;
      document.getElementById("colorDepth").innerHTML = screen.colorDepth;
    };

    var playerTypes = [3, 0, 1, 0];
    var buttonNames = ['#p1button', '#p2button', '#p3button', '#p4button',
      '#p1Lbutton', '#p2Lbutton', '#p3Lbutton', '#p4Lbutton'
    ];
    var typeNames = [" None ", "Random", " Same ", " New  "];
    var textFields = ['#p1textfield', '#p2textfield', '#p3textfield', '#p4textfield'];

    // var targetPts = [ new Point( 0.375,0), new Point( 0.25, 0.375), new Point( -0.25, 0.375),
    //    new Point(-0.375,0), new Point(-0.25,-0.375), new Point(  0.25,-0.375)];
    /* Worm  Constants */

    window.compassPts = ["e", "ne", "nw", "w", "sw", "se", "unSet", "isTrapped"];
    window.wormStates = {
      "dead": 0,
      "moving": 1,
      "paused": 2,
      "sleeping": 3,
      "dying": 4   //  dead but let the game keep going for a few frames to animate
    };
    window.wormStateNames = ["dead", "moving", "paused", "sleeping", "dying"];
    window.initialWormStates = [3, 2, 2, 2];
    var gWorms = [new Worm(1, wormStates.paused), new Worm(2, wormStates.paused), new Worm(3, wormStates.paused), new Worm(4, wormStates.paused)];


    var setTypes = function() {
      // document.getElementById("p1button").innerHTML = typeNames[players[0]];
      // document.getElementById("p1button").html(typeNames[players[0]]).button("refresh");
      $("#p1button").text(typeNames[playerTypes[0]]);
      $("#p2button").text(typeNames[playerTypes[1]]);
      $("#p3button").text(typeNames[playerTypes[2]]);
      $("#p4button").text(typeNames[playerTypes[3]]);

      $("#p1Lbutton").text(typeNames[playerTypes[0]]);
      $("#p2Lbutton").text(typeNames[playerTypes[1]]);
      $("#p3Lbutton").text(typeNames[playerTypes[2]]);
      $("#p4Lbutton").text(typeNames[playerTypes[3]]);
      var bref = $("#p4button");
      var brefa = bref[0];

      gWorms.forEach(function(worm, i) {
        worm.wType = playerTypes[i];
        // worm.setNotes(i);
        $(buttonNames[i]).removeClass(
          playerTypes[i] === 0 ? "ui-opaque" : "ui-grayed-out");
        $(buttonNames[i]).addClass(
          playerTypes[i] === 0 ? "ui-grayed-out" : "ui-opaque");
      });
    };


    var setupRadioButtons = function() {
      darworms.selectedDarworm = $.mobile.activePage.attr("data-selecteddarworm");
      if (darworms.theGame && darworms.theGame.gameState !== darworms.gameStates.over) {
        $('.darwormTypeRadioButtons').hide();
        $('.playKeyNotes').hide();
      } else {
        $('.darwormTypeRadioButtons').show();
        $('.playKeyNotes').show();
        var darwormType = playerTypes[darworms.selectedDarworm];
        var color = darworms.colorNames[darworms.selectedDarworm];
        switch (darwormType) {
          case 0:
            $('#' + color + '-radio-choice-1').prop("checked", true).checkboxradio("refresh");
            break;
          case 1:
            $('#' + color + '-radio-choice-2').prop("checked", true).checkboxradio("refresh");
            break;
          case 2:
            $('#' + color + '-radio-choice-3').prop("checked", true).checkboxradio("refresh");
            break;
          case 3:
            $('#' + color + '-radio-choice-4').prop("checked", true).checkboxradio("refresh");
            break;
        }
        var selectinput = 'input[name=' + color + '-radio-choice]';
        $(selectinput).checkboxradio("refresh");
        // $('input[name=green-radio-choice]').checkboxradio("refresh");
        var selectedType = $(selectinput + ':checked').val();
        gWorms.forEach(function(worm, i) {
          worm.toText();
          $(textFields[i]).val(playerTypes[i] == 0 ? "" : worm.name);
        });
      }
    };

    var setSelectedDarwormType = function() {
      // This may no longer be needed since each properties page now
      // directly sets the wTypes.
      if (darworms.theGame && darworms.theGame.gameState !== darworms.gameStates.over) {
        return;
      }
      var color = darworms.colorNames[darworms.selectedDarworm];
      var selectinput = 'input[name=' + color + '-radio-choice]';
      var selectedType = $(selectinput + ':checked').val();
      switch (selectedType) {
        case "none":
          playerTypes[darworms.selectedDarworm] = 0;
          break;
        case "random":
          playerTypes[darworms.selectedDarworm] = 1;
          break;
        case "same":
          playerTypes[darworms.selectedDarworm] = 2;
          break;
        case "new":
          playerTypes[darworms.selectedDarworm] = 3;
          break

        default:
          alert("unknown type");
      }
      setTypes();
    };

    var showSettings = function() {
      if (darworms.theGame && darworms.theGame.gameState !== darworms.gameStates.over) {
        $('#geometryradios').hide();
        $('#abortgame').show();
      } else {
        $('#geometryradios').show();
        $('#abortgame').hide();
      }

      console.log(" showSettings ");
    };


    var setupGridGeometry = function() {
      console.log(" pagebeforeshow setupGridGeometry ");
      if (darworms.theGame && darworms.theGame.gameState !== darworms.gameStates.over) {
        $('#geometryradios').hide();
      } else {
        $('#geometryradios').show();
      }

      var gridGeometry = darworms.dwsettings.gridGeometry;

      switch (gridGeometry) {
        case 'torus':
          $('#geometry-radio-torus').prop("checked", true).checkboxradio("refresh");
          break;
        case 'falloff':
          $('#geometry-radio-falloff').prop("checked", true).checkboxradio("refresh");
          break;
        case 'reflect':
          $('#geometry-radio-reflect').prop("checked", true).checkboxradio("refresh");
          break;
        default:
          alert(" unknown grid geometry requested: " + gridGeometry);

      }
    };

    var applySettings = function() {
      var selectedGeometry = $('input[name=geometry-radio-choice]:checked').val();
      darworms.dwsettings.gridGeometry = selectedGeometry;

      if (darworms.dwsettings.backGroundTheme !== $('#backg').slider().val()) {
        darworms.dwsettings.backGroundTheme = $('#backg').slider().val();
        if (darworms.theGame) {
          darworms.theGame.clearCanvas();
          darworms.theGame.drawCells();
        }
      }
      darworms.dwsettings.doAnimations = $('#doanim').slider().val() == "true" ? true : false;
      darworms.dwsettings.doAudio = $('#audioon').slider().val();
      darworms.dwsettings.fixedInitPos = $('#fixedinitpos').slider().val();
      darworms.dwsettings.panToSelectionUI = $('#panToSelectionUI').slider().val();
      darworms.dwsettings.pickDirectionUI = $('#pickDirectionUI').slider().val();

      console.log(" darworms.dwsettings.doAnimations " + darworms.dwsettings.doAnimations);
      console.log(" darworms.dwsettings.doAudio " + darworms.doAudio);
      darworms.masterAudioVolume = $("#audiovol").val() / 100;
      darworms.graphics.fps = $("#fps").val();
      darworms.graphics.frameInterval = 1000 / darworms.graphics.fps;

      console.log(" darworms.masterAudioVolume " + darworms.masterAudioVolume);
    };

    var pointerEventToXY = function(e) {
      var out = {
        x: 0,
        y: 0
      };
      if (e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel') {
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX;
        out.y = touch.pageY;
      } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type == 'mouseout' || e.type == 'mouseenter' || e.type == 'mouseleave') {
        out.x = e.pageX;
        out.y = e.pageY;
      } else if (e.type == 'tap') {
        out.x = (e.clientX || e.changedTouches[0].pageX) - (e.currentTarget.offsetLeft);
        out.y = (e.clientY || e.changedTouches[0].pageY) - (e.currentTarget.offsetTop);
      }
      return out;
    };

    var wormEventHandler = function(event) {
      var loc = pointerEventToXY(event);
      var touchX = loc.x;
      var touchY = loc.y;
      /*
      var touchX = (event.offsetX || event.clientX);
      var touchY = (event.offsetY || event.clientY);
      var touchX = touchX - event.currentTarget.;  //  padding between canvas container and wcanvas
      var touchY = touchY - 15;  //  padding between canvas container and wcanvas
      // alert( event.toString() + " tap event x:" + touchX + "  y:" + touchY)
      */

      var cWidth = $('#wcanvas').width();
      var cHeight = $('#wcanvas').height();
      console.log(" Tap Event at x: " + touchX + " y: " + touchY);
      // console.log(" wcanvas css   width " + $('#wcanvas').width() + " css   height " + $('#wcanvas').height());
      // console.log (" wcanvas coord width " + darworms.main.wCanvas.width + " coord height "  + darworms.main.wCanvas.height  );
      if (darworms.theGame.gameState === darworms.gameStates.waiting) {
        if (darworms.dwsettings.panToSelectionUI == 0) { //main screen small ui
          darworms.gameModule.selectDirection(new Point(touchX, touchY));
        } else {
          if (darworms.gameModule.doZoomOut(new Point((touchX / cWidth) * 2.0 - 1.0, ((touchY) / cHeight) * 2.0 - 1.0))) {
            console.log(" do zoomout here");
          } else {
            // console.log(" touch event at " + new Point(touchX, touchY).format);
            darworms.gameModule.selectDirection(new Point(touchX, touchY));

          }
        }
      }
    };
    darworms.menuButton = function() {
      console.log(" menuButton");
      if ( darworms.theGame.gameState &&  ((darworms.theGame.gameState == darworms.gameStates.running) ||
        (darworms.theGame.gameState == darworms.gameStates.paused))) {
        darworms.theGame.gameState = darworms.gameStates.paused;
        $.mobile.changePage("#settingspage");
        $("#startpause").text("Resume Game");
      } else {
        if (darworms.theGame.gameState == darworms.gameStates.waiting) {
          $.mobile.changePage("#settingspage");
        } else {
          $.mobile.changePage("#menupage");
        }
      }
    };
    darworms.setKeyVal = function(index) {
      var selectedKeyInput = $('#select-native-key-' + darworms.colorNames[index]);
      if (selectedKeyInput.length == 1) {
        gWorms[index].setKey(selectedKeyInput.val());
      }
    };
    darworms.setInstrumentVal = function(index) {
      var selectedInstrumentInput = $('#select-native-' + darworms.colorNames[index]);
      if (selectedInstrumentInput.length == 1) {
        gWorms[darworms.selectedDarworm].setNotes(parseInt(selectedInstrumentInput.val()));
      }
    };
    darworms.startgame = function(startNow) {
      var heightSlider = Math.floor($("#gridsize").val());
      var curScreen = new Point($('#wcanvas').width(), $('#wcanvas').height());
      if (darworms.theGame === undefined || darworms.theGame === null || darworms.theGame.grid.height != heightSlider ||
        !(darworms.wCanvasPixelDim.isEqualTo(curScreen))) {
        console.log(" theGame size has changed Screen is" + curScreen.format() + " grid = " + heightSlider + " x " +
          heightSlider);
        if ((heightSlider & 1) !== 0) {
          // height must be an even number because of toroid shape
          heightSlider = heightSlider + 1;
        }
        darworms.main.wCanvas.width = $('#wcanvas').width();
        darworms.main.wCanvas.height = $('#wcanvas').height(); // make it square
        darworms.wCanvasPixelDim = curScreen;
        if ($('#debug').slider().val() === 1) {
          alert(" wCanvas " + darworms.main.wCanvas.width + " x " + darworms.main.wCanvas.height +
            " css " + $('#wcanvas').width() + " x " + $('#wcanvas').height() +
            " window " + window.innerWidth + " x " + window.innerHeight);
        }
        darworms.theGame = new darworms.gameModule.Game(heightSlider, heightSlider);
      }
      if (darworms.theGame.gameState === darworms.gameStates.over) {
        darworms.theGame.initGame();
        $("#startpause").text("Start Game");
        darworms.theGame.needsRedraw = true;
        darworms.theGame.drawCells();
        darworms.theGame.worms = gWorms;
        console.log(" init gridsize: " + $("#gridsize").val() + " gHeight" + heightSlider);

        gWorms.forEach(function(worm, i) {
          worm.init(playerTypes[i]);
          if (playerTypes[i] !== 0) { //  not None

            $(buttonNames[i]).addClass("ui-opaque");
          } else {
            $(buttonNames[i]).addClass("ui-grayed-out");
          }
          $(textFields[i]).val(worm.toText());
          var startingPoint = ((darworms.dwsettings.fixedInitPos == 1) ? darworms.theGame.origin :
             new Point ((Math.floor(Math.random() * darworms.theGame.grid.width)),
           (Math.floor(Math.random() * darworms.theGame.grid.height))));


          worm.place(initialWormStates[playerTypes[i]], darworms.theGame,
            startingPoint);
            if (playerTypes[i] !== 0) { //  not None
                darworms.theGame.grid.setSinkAt(startingPoint);
            }
        });
      }
      darworms.gameModule.updateScores();
      if (startNow === false) return;
      console.log(" NEW in startgame darworms.dwsettings.doAnimations " + darworms.dwsettings.doAnimations);
      if (darworms.theGame.gameState === darworms.gameStates.running) {
        // This is now a pause game button
        // clearInterval(darworms.graphics.timer);
        // document.getElementById("startpause").innerHTML = "Resume Game";
        $("#startpause").text("Resume Game");
        darworms.theGame.gameState = darworms.gameStates.paused;
        return;
      }
      if (darworms.theGame.gameState === darworms.gameStates.paused) {
        // This is now a start game button
        // document.getElementById("startpause").innerHTML = "Pause Game";
        $("#startpause").text("Pause");
        darworms.theGame.gameState = darworms.gameStates.running;
        // darworms.graphics.timer = setInterval(updateGameState, 1000 / $("#fps").val());
        // startGameLoop( $("#fps").val());
        return;
      }
      if (darworms.theGame.gameState === darworms.gameStates.over) {
        // This is now a start game button
        // alert("About to Start Game.");
        darworms.theGame.gameState = darworms.gameStates.running;
        // darworms.graphics.timer = setInterval(updateGameState, 1000 / $("#fps").val());
        var animFramesPerSec = darworms.dwsettings.doAnimations ? $("#fps").val() : 60;
        startGameLoop(animFramesPerSec);
        console.log(" setInterval: " + 1000 / $("#fps").val());
        // document.getElementById("startpause").innerHTML = "Pause Game";
        $("#startpause").text("Pause Game");
        initTheGame(true);
        darworms.theGame.log();
      }
      if (!darworms.dwsettings.doAnimations) {
        // run game loop inline and draw after game is over
        //  No.  This locks the browser.  We must put it inside the the
        // animation request and do a set of moves each animframe and draw the
        // playfield
        console.log('darworms.dwsettings.doAnimations == "false"');
        darworms.theGame.gameState = darworms.gameStates.running;
        darworms.theGame.clearCanvas();
        darworms.theGame.drawCells();

        console.log(" Game Running");
        $("#startpause").text("Running");
       /*  busy loop maling moves.  Freezes the javascript engine
         while (darworms.theGame.gameState != darworms.gameStates.over) {
          if (darworms.theGame.gameState === darworms.gameStates.waiting) {
            break;
          }
          if (darworms.theGame.makeMove(false) === false) {
            darworms.theGame.elapsedTime = darworms.theGame.elapsedTime + new Date().getTime();
            console.log(" Game Over");
            darworms.theGame.showTimes();
            darworms.theGame.gameState = darworms.gameStates.over;
            $("#startpause").text("Start Game");
            // wGraphics.restore();
          }
        }
        darworms.theGame.drawCells();
        darworms.gameModule.updateScores();

        $("#startpause").text("Start Game");
        */
      }

    };

    var startGameLoop = function(frameRate) {
      darworms.graphics.fps = frameRate;
      darworms.graphics.frameInterval = 1000 / frameRate;
      darworms.graphics.iufps = 30;
      darworms.graphics.uiInterval = 1000 / frameRate;
      darworms.graphics.animFrame = 0;
      darworms.graphics.uiFrames = 0;

      darworms.graphics.rawFrameCount = 0;
      darworms.graphics.drawFrameCount = 0;
      darworms.graphics.rawFrameCount = 0;
      darworms.graphics.uiFrameCount = 0;
      darworms.graphics.then = Date.now();

      darworms.graphics.uiThen = Date.now();
      darworms.graphics.startTime = darworms.graphics.then;
      darworms.graphics.uiInterval = 1000 / darworms.graphics.uifps;
      doGameLoop();
    };

    var doGameLoop = function() {
      // This is the game loop
      // Called from requestAnimationFrame
      // We either make one round of moves
      // or if we are waiting for user input
      // and we draw the direction selection screen
      //

      darworms.graphics.rawFrameCount++;
      if (darworms.theGame.gameState == darworms.gameStates.over) {
        //  end of game cleanup
        gWorms.forEach(function(worm, i) {
          if (worm.wType == 3) { //  new
            worm.wType = 2; // Same

          }
          worm.toText(); //  update string version of dna
        });
        for (let ig = 0; ig < 4; ig++) {
          playerTypes[ig] = gWorms[ig].wType;
        }
        setTypes();
        setupRadioButtons();
        return;
      }
      requestAnimationFrame(doGameLoop);
      //   makes game moves or select a new direction for a worm
      //  update graphics
      darworms.graphics.animFrame = darworms.graphics.animFrame + 1;
      if (darworms.theGame.gameState === darworms.gameStates.running) {
        darworms.graphics.now = Date.now();
        if (darworms.dwsettings.doAnimations) {
          darworms.graphics.elapsed = darworms.graphics.now - darworms.graphics.then;
          if (darworms.graphics.elapsed > darworms.graphics.frameInterval) {
            darworms.graphics.uiFrames = darworms.graphics.uiFrames + 1;
            darworms.gameModule.makeMoves();
            darworms.graphics.then = darworms.graphics.now -
              (darworms.graphics.elapsed % darworms.graphics.frameInterval);
          }

        }  else {
            var nMoves = 0;
            while ((nMoves < 50)  &&  (darworms.theGame.gameState != darworms.gameStates.over) &&
          (darworms.theGame.gameState !== darworms.gameStates.waiting)) {
              nMoves = nMoves + 1;            darworms.gameModule.makeMoves();
            }
            darworms.gameModule.updateScores();
            darworms.theGame.drawDirtyCells();
            console.log(".");
        }

      }
      if (darworms.theGame.gameState === darworms.gameStates.animToUI ||
        darworms.theGame.gameState === darworms.gameStates.animFromUI) {
        darworms.theGame.animIn(darworms.theGame.gameState);
      }

      if (darworms.theGame.gameState === darworms.gameStates.waiting) {
        darworms.graphics.now = Date.now();
        darworms.graphics.uiElapsed = darworms.graphics.now - darworms.graphics.uiThen;
        if (darworms.graphics.uiElapsed > darworms.graphics.uiInterval) {
          if (darworms.dwsettings.panToSelectionUI == 1) {
            darworms.theGame.drawSelectCell(true);
          } else {
            darworms.theGame.drawPickCells();
            // darworms.theGame.drawSelectCell(false);
          }
          darworms.graphics.uiThen = darworms.graphics.now -
            (darworms.graphics.uiElapsed % darworms.graphics.uiInterval);
        }
      }

      // if ( darworms.graphics.rawFrameCount %  60 == 0) {
      //     console.log("Date.now() " + Date.now());
      // }
    };

    darworms.abortgame = function() {
      console.log("Abort Game called");
      $.mobile.changePage('#abortdialog', 'pop', true, true);
      // $("#lnkDialog").click();

    };

    darworms.playScale = function(index) {
      console.log("playScale called");
      gWorms[index].playScale();


    };
    darworms.yesabortgame = function() {
      console.log("Abort Game called");
      $.mobile.changePage('#playpage');
      darworms.theGame.gameState = darworms.gameStates.over;
      darworms.startgame(false);
      // $("#lnkDialog").click();

    };

    darworms.noabortgame = function() {
      console.log("Abort Game called");
      $.mobile.changePage('#settingspage');
      // $("#lnkDialog").click();

    };
    var initTheGame = function(startNow) {

      gWorms.forEach(function(worm, i) {
        $(textFields[i]).val(worm.toText());
        // worm.setNotes(i);
      });
      if (startNow) {
        darworms.theGame.gameState = darworms.gameStates.running;

      } else {
        darworms.theGame.gameState = darworms.gameStates.over;

      }
      // startgame(startNow);
      darworms.theGame.needsRedraw = true;

    };
    var resizeCanvas = function() {
      var xc = $('#wcanvas');
      var sc = $('#scorecanvas');
      var nc = $('#navcontainer');
      var w = $(window).width();
      var h = $(window).height();

      if (h > 400) {
        xc.css({
          width: w - 20 + 'px',
          height: h - 130 + 'px'
        });
        sc.css({
          width: w - 20 + 'px',
          height: 30 + 'px'

        });
      } else {
        var nw = Math.floor(w * .70);
        xc.css({
          width: nw + 'px',
          height: h - 110 + 'px'
        });
        sc.css({
          width: nw + 'px'

        });

      }
      if ($('#debug').slider().val() === "1") {
        alert(" Resize " + w + " x " + h + " debug " + $('#debug').slider().val() + "arg " + nw);
      }
    };
    var initPlayPage = function() {
      if (!darworms.playpageInitialized) {
        darworms.startgame(false);
        darworms.audioContext.resume();
        darworms.playpageInitialized = true;
        resizeCanvas();
      }
    };

    var loadAudio = function() {
      darworms.audioContext;

      // Create Smart Audio Container
      if (typeof AudioContext !== "undefined") {
        darworms.audioContext = new AudioContext();
      } else if (typeof webkitAudioContext !== "undefined") {
        darworms.audioContext = new webkitAudioContext();
      } else {
        darworms.dwsettings.doAudio = false;
        alert(" Could not load webAudio... muting game");
        $('#doAudio').hide();
      }

      if (darworms.dwsettings.doAudio) {
        if (darworms.audioContext.createGain !== undefined) {
          darworms.masterGainNode = darworms.audioContext.createGain(0.5);
        }
        if (darworms.audioContext.createStereoPanner  !== undefined) {
          darworms.audioPanner = darworms.audioContext.createStereoPanner();
        }


        //   loading AudioSample Files
        /*
        if (useKalimbaAudio) {
          new AudioSample("b3", "sounds/a_kalimba_b3.wav");
          new AudioSample("c4", "sounds/b_kalimba_c4.wav");
          new AudioSample("d4", "sounds/c_kalimba_d4.wav");
          new AudioSample("e4", "sounds/d_kalimba_e4.wav");
          new AudioSample("fsharp4", "sounds/e_kalimba_fsharp4.wav");
          new AudioSample("g4", "sounds/f_kalimba_g4.wav");
          new AudioSample("a4", "sounds/g_kalimba_a4.wav");
          new AudioSample("b4", "sounds/h_kalimba_b4.wav");
          new AudioSample("c5", "sounds/i_kalimba_c5.wav");
          new AudioSample("b3", "sounds/j_kalimba_d5.wav");
          new AudioSample("e5", "sounds/k_kalimba_e5.wav");
          new AudioSample("fsharp5", "sounds/l_kalimba_fsharp5.wav");
          new AudioSample("g5", "sounds/m_kalimba_g5.wav");
          new AudioSample("a5", "sounds/n_kalimba_a5.wav");
          new AudioSample("b5", "sounds/o_kalimba_b5.wav");
          new AudioSample("c6", "sounds/p_kalimba_c6.wav");

        }
        if (usePianoAudio) {
          new AudioSample("a1", "sounds/piano/a1.wav");
          new AudioSample("a1s", "sounds/piano/a1s.wav");
          new AudioSample("b1", "sounds/piano/b1.wav");
          new AudioSample("c1", "sounds/piano/c1.wav");
          new AudioSample("c1s", "sounds/piano/c1s.wav");
          new AudioSample("c2", "sounds/piano/c2.wav");
          new AudioSample("d1", "sounds/piano/d1.wav");
          new AudioSample("d1s", "sounds/piano/a1.wav");
          new AudioSample("e1", "sounds/piano/e1.wav");
          new AudioSample("f1", "sounds/piano/f1.wav");
          new AudioSample("f1s", "sounds/piano/f1s.wav");
          new AudioSample("g1", "sounds/piano/g1.wav");
          new AudioSample("g1s", "sounds/piano/g1s.wav");
        }
        if (useSitarAudio) {
          new AudioSample("sitar1", "sounds/sitar/sitar1.wav");
          new AudioSample("sitar2", "sounds/sitar/sitar2.wav");
          new AudioSample("sitar3", "sounds/sitar/sitar3.wav");
          new AudioSample("sitar4", "sounds/sitar/sitar4.wav");
          new AudioSample("sitar5", "sounds/sitar/sitar5.wav");
          new AudioSample("sitar6", "sounds/sitar/sitar6.wav");

        }
        */

        new AudioSample("piano", "sounds/piano-c2.wav");
        new AudioSample("guitar", "sounds/GuitarTrimmed.wav");
        new AudioSample("kalimba", "sounds/i_kalimba_c5.wav");
        new AudioSample("sitar", "sounds/Sitar-C5.wav");
        new AudioSample("flute", "sounds/FluteC3Trimmed.wav");
        new AudioSample("clarinet", "sounds/ClarinetTrimmed.wav");
        new AudioSample("death", "sounds/death.wav");

      }
      var twelfrootoftwo = 1.05946309436;
      var noteRate = 0.5; // lowest note
      var noteFrequency = 261.626;
      do {
        darworms.audioPlaybackRates.push(noteRate);
        darworms.audioFrequencies.push(noteFrequency * noteRate);
        noteRate = noteRate * twelfrootoftwo;

      }
      while (darworms.audioPlaybackRates.length < 13);
      console.log("Final rate = " + darworms.audioPlaybackRates[12] + "  error: " +
        (1.0 - darworms.audioPlaybackRates[12]));

      darworms.audioPlaybackRates[12] = 1.0;



      // context state at this time is `undefined` in iOS8 Safari
      if (darworms.audioContext.state === 'suspended') {
        var resume = function() {
          darworms.audioContext.resume();

          setTimeout(function() {
            if (darworms.audioContext.state === 'running') {
              document.body.removeEventListener('touchend', resume, false);
            }
          }, 0);
        };

        document.body.addEventListener('touchend', resume, false);
      }

    };
    var typeFromName = function(name) {
      switch (name) {
        case "none":
          return 0;
          break;
        case "random":
          return 1;
          break;
        case "same":
          return 2;
          break;
        case "new":
          return 3;
          break

        default:
          alert("unknown type (not none, randowm, new or same)");
          return 0;
      }
    };
    var init = function() {
      // This may be needed when we actually build a phoneGap app
      // in this case delay initialization until we get the deviceready event
      document.addEventListener("deviceready", deviceInfo, true);
      darworms.wCanvasPixelDim = new Point(1, 1);
      // window.onresize = doReSize;
      // doReSize();

      darworms.main.wCanvas = document.getElementById("wcanvas");
      darworms.main.wGraphics = darworms.main.wCanvas.getContext("2d");
      // console.log ( " init wGraphics " + darworms.main.wGraphics);
      $('#wcanvas').bind('tap', wormEventHandler);
      // $('#wcanvas').on("tap", wormEventHandler);
      // $('#wcanvas').bind('vmousedown', wormEventHandler);
      $('#panToSelectionUI').slider().val(0);
      $('#panToSelectionUI').slider("refresh");

      // this should depend on scale factor.  On small screens
      // we cshould set pickDirectionUI to true
      $('#pickDirectionUI').slider().val(0);
      $('#pickDirectionUI').slider("refresh");


      darworms.wCanvasRef = $('#wcanvas');

      loadAudio();

      setTypes();

      applySettings();


      darworms.dwsettings.scoreCanvas = document.getElementById("scorecanvas");
      darworms.gameModule.init(); // needed to init local data in the gameModule closure
      //  These values are needed by both mainModule and gameModule
      //  so for now we keep them as globals
      //  Perhaps the time routines should all be moved into the gameModule closure
      // and we can make some or all of these private to the gameModule closure
      // darworms.theGame = new darworms.gameModule.Game ( darworms.dwsettings.initialGridSize, darworms.dwsettings.initialGridSize);
      // darworms.startgame(false);
      darworms.dwsettings.noWhere = new Point(-1, -1);


      //  The following code is designed to remove the toolbar on mobile Safari
      if (!window.location.hash && window.addEventListener) {
        window.addEventListener("load", function() {
          console.log("load event listener triggered");
          setTimeout(function() {
            window.scrollTo(0, 0);
          }, 100);
        });
        window.addEventListener("orientationchange", function() {
          setTimeout(function() {
            window.scrollTo(0, 0);
          }, 100);
        });
      }
      $(window).bind('resize orientationchange', function(event) {
        window.scrollTo(1, 0);
        resizeCanvas();
        var heightSlider = Math.floor($("#gridsize").val());
        if ((heightSlider & 1) !== 0) {
          // height must be an even number because of toroid shape
          heightSlider = heightSlider + 1;
        }
        darworms.gameModule.reScale(heightSlider, heightSlider);
      });

      gWorms.forEach(function(worm, i) {
        worm.setNotes(0);
      });
      resizeCanvas();
      $("input[name='red-radio-choice']").on("change", function() {
        console.log(" red-radio-choice on change function");
        var type = ($("input[name='red-radio-choice']:checked").val());
        gWorms[0].init(typeFromName(type));
        $(textFields[0]).val(typeFromName(type) == 0 ? "" : gWorms[0].name);

      });
      $("input[name='green-radio-choice']").on("change", function() {
        console.log(" green-radio-choice on change function");
        var type = ($("input[name='green-radio-choice']:checked").val());
        gWorms[1].init(typeFromName(type));
        $(textFields[1]).val(typeFromName(type) == 0 ? "" : gWorms[1].name);

      });
      $("input[name='blue-radio-choice']").on("change", function() {
        console.log(" blue-radio-choice on change function");
        var type = ($("input[name='blue-radio-choice']:checked").val());
        gWorms[2].init(typeFromName(type));
        $(textFields[2]).val(typeFromName(type) == 0 ? "" : gWorms[2].name);

      });
      $("input[name='yellow-radio-choice']").on("change", function() {
        console.log(" yellow-radio-choice on change function");
        var type = ($("input[name='yellow-radio-choice']:checked").val());
        gWorms[3].init(typeFromName(type));
        $(textFields[3]).val(typeFromName(type) == 0 ? "" : gWorms[3].name);

      });
      //  These four handlers should be combined into one parameterized one or
      //  generated closures for each one
      $("input[name='red-textname']").on("change", function() {
        console.log(" red-textname");
        var dnastring = ($("input[name='red-textname']").val());
        var regx = /^[ABCDEF\?]{63}X$/;
        if (regx.test(dnastring)) {
          if (gWorms[0].fromText(dnastring)) {
            gWorms[0].wType = 2; // Same
            playerTypes[0] = 2;
            setupRadioButtons();


            $("#p1button").text(typeNames[playerTypes[0]]);
            $("#p1Lbutton").text(typeNames[playerTypes[0]]);
            gWorms[0].toText();
            $("input[name='red-textname']").textinput({
              theme: "c"
            });
          }      } else {
          $("input[name='red-textname']").textinput({
            theme: "a"
          });
        }
      });
      $("input[name='green-textname']").on("change", function() {
        console.log(" green-textname");
        var dnastring = ($("input[name='green-textname']").val());
        var regx = /^[ABCDEF\?]{63}X$/;
        if (regx.test(dnastring)) {
          if (gWorms[1].fromText(dnastring)) {
            gWorms[1].wType = 2; // Same
            playerTypes[1] = 2;
            setupRadioButtons();


            $("#p2button").text(typeNames[playerTypes[1]]);
            $("#p2Lbutton").text(typeNames[playerTypes[1]]);
            gWorms[1].toText();
            $("input[name='green-textname']").textinput({
              theme: "d"
            });
          }      } else {
          $("input[name='green-textname']").textinput({
            theme: "a"
          });
        }
      });
      $("input[name='blue-textname']").on("change", function() {
        console.log(" blue-textname");
        var dnastring = ($("input[name='blue-textname']").val());
        var regx = /^[ABCDEF\?]{63}X$/;
        if (regx.test(dnastring)) {
          if (gWorms[2].fromText(dnastring)) {
            gWorms[2].wType = 2; // Same
            playerTypes[2] = 2;
            setupRadioButtons();


            $("#p3button").text(typeNames[playerTypes[2]]);
            $("#p3Lbutton").text(typeNames[playerTypes[2]]);
            gWorms[2].toText();
            $("input[name='blue-textname']").textinput({
              theme: "e"
            });
          }      } else {
          $("input[name='green-textname']").textinput({
            theme: "a"
          });
        }
      });
      $("input[name='yellow-textname']").on("change", function() {
        console.log(" yellow-textname");
        var dnastring = ($("input[name='yellow-textname']").val());
        var regx = /^[ABCDEF\?]{63}X$/;
        if (regx.test(dnastring)) {
          if (gWorms[3].fromText(dnastring)) {
            gWorms[3].wType = 2; // Same
            playerTypes[3] = 2;
            setupRadioButtons();


            $("#p4button").text(typeNames[playerTypes[2]]);
            $("#p4Lbutton").text(typeNames[playerTypes[2]]);
            gWorms[2].toText();
            $("input[name='yellow-textname']").textinput({
              theme: "f"
            });
          }      } else {
          $("input[name='green-textname']").textinput({
            theme: "a"
          });
        }
      });
      $("input[name='select-native-key-red']").on("change", function() {
        console.log(" select-key-red");

      });
    };

    return {
      init: init,

      setSelectedDarwormType: setSelectedDarwormType,
      setupRadioButtons: setupRadioButtons,
      applySettings: applySettings,
      showSettings: showSettings,
      setupGridGeometry: setupGridGeometry,
      initPlayPage: initPlayPage,
      wormEventHandler: wormEventHandler

    };

  })();
  /* end of Game */

}());
//# sourceMappingURL=bundle.js.map