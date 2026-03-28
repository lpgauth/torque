window.BENCHMARK_DATA = {
  "lastUpdate": 1774704545837,
  "repoUrl": "https://github.com/lpgauth/torque",
  "entries": {
    "Torque Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "17ca9a0b0a616e94b1a06a17f24989387a33d94e",
          "message": "Fix simdjsone compilation",
          "timestamp": "2026-03-21T17:37:24-04:00",
          "tree_id": "b8f016ad50b9ae85390634806ab917b0aef19c5b",
          "url": "https://github.com/lpgauth/torque/commit/17ca9a0b0a616e94b1a06a17f24989387a33d94e"
        },
        "date": 1774129435166,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "torque decode",
            "value": 164519.8017098653,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone decode",
            "value": 133485.2704881282,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy decode",
            "value": 73404.51713932648,
            "unit": "iterations/s"
          },
          {
            "name": "otp json decode",
            "value": 71443.79218081506,
            "unit": "iterations/s"
          },
          {
            "name": "jason decode",
            "value": 66277.47152125664,
            "unit": "iterations/s"
          },
          {
            "name": "torque parse+get_many_nil",
            "value": 127605.42140350907,
            "unit": "iterations/s"
          },
          {
            "name": "torque parse+get_many",
            "value": 127317.65230806464,
            "unit": "iterations/s"
          },
          {
            "name": "torque parse+get",
            "value": 101513.40473227116,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone parse+get",
            "value": 76877.83330291425,
            "unit": "iterations/s"
          },
          {
            "name": "torque [proplist() :: binary()]",
            "value": 791694.3679536396,
            "unit": "iterations/s"
          },
          {
            "name": "torque [proplist() :: iodata()]",
            "value": 772076.907813022,
            "unit": "iterations/s"
          },
          {
            "name": "torque [map() :: iodata()]",
            "value": 662285.6186005804,
            "unit": "iterations/s"
          },
          {
            "name": "torque [map() :: binary()]",
            "value": 643232.7275494437,
            "unit": "iterations/s"
          },
          {
            "name": "otp json [map() :: iodata()]",
            "value": 491590.495837705,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy [proplist() :: iodata()]",
            "value": 406318.4399478911,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone [proplist() :: iodata()]",
            "value": 392677.64369348926,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy [map() :: iodata()]",
            "value": 339154.9450356695,
            "unit": "iterations/s"
          },
          {
            "name": "otp json [map() :: binary()]",
            "value": 317630.77689053805,
            "unit": "iterations/s"
          },
          {
            "name": "jason [map() :: iodata()]",
            "value": 312063.4983536024,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone [map() :: iodata()]",
            "value": 309128.3474508329,
            "unit": "iterations/s"
          },
          {
            "name": "jason [map() :: binary()]",
            "value": 227919.34538535416,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone decode",
            "value": 257.47004348947513,
            "unit": "iterations/s"
          },
          {
            "name": "torque decode",
            "value": 241.6273459048657,
            "unit": "iterations/s"
          },
          {
            "name": "otp json decode",
            "value": 111.83999780710522,
            "unit": "iterations/s"
          },
          {
            "name": "jason decode",
            "value": 85.95097918266823,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy decode",
            "value": 55.89346199748514,
            "unit": "iterations/s"
          },
          {
            "name": "torque [proplist() :: binary()]",
            "value": 572.0804259334856,
            "unit": "iterations/s"
          },
          {
            "name": "torque [proplist() :: iodata()]",
            "value": 564.7258193728827,
            "unit": "iterations/s"
          },
          {
            "name": "torque [map() :: iodata()]",
            "value": 477.8708138822127,
            "unit": "iterations/s"
          },
          {
            "name": "torque [map() :: binary()]",
            "value": 475.3511455989929,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy [proplist() :: iodata()]",
            "value": 294.5378285645238,
            "unit": "iterations/s"
          },
          {
            "name": "otp json [map() :: iodata()]",
            "value": 259.82768671864136,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy [map() :: iodata()]",
            "value": 247.94241862114083,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone [proplist() :: iodata()]",
            "value": 242.2895990329278,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone [map() :: iodata()]",
            "value": 205.1336155209063,
            "unit": "iterations/s"
          },
          {
            "name": "jason [map() :: iodata()]",
            "value": 167.0860974741863,
            "unit": "iterations/s"
          },
          {
            "name": "otp json [map() :: binary()]",
            "value": 163.13305094630368,
            "unit": "iterations/s"
          },
          {
            "name": "jason [map() :: binary()]",
            "value": 113.30380135628383,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "0e3c13d45310ebac50998f6c7e7fbc4671063aca",
          "message": "Merge pull request #13 from lpgauth/ci/benchmark-page-improvements\n\nImprove benchmark page with comparison tables and torque-only trend c…",
          "timestamp": "2026-03-22T07:06:43-04:00",
          "tree_id": "63ff53552331dfb1c47caa5292746f922d196367",
          "url": "https://github.com/lpgauth/torque/commit/0e3c13d45310ebac50998f6c7e7fbc4671063aca"
        },
        "date": 1774177964590,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 147461.82012657885,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 102220.62819211179,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 100119.11234089192,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 86344.81969363586,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 836728.5861857742,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 833790.5882608885,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 677128.8431276128,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 675392.8571984564,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 253.05893828712746,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 686.1787810581776,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 681.5943291646644,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 570.325945767721,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 570.2899584627667,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "d3b7d708e15a2f085292c9cd304ab954a366896e",
          "message": "Fix chart height by wrapping canvas in sized container",
          "timestamp": "2026-03-22T07:27:02-04:00",
          "tree_id": "4a4d2f41450d158cb3f1ea01818dfb61cdda5076",
          "url": "https://github.com/lpgauth/torque/commit/d3b7d708e15a2f085292c9cd304ab954a366896e"
        },
        "date": 1774179177353,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 143966.19531774806,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 98614.13046945125,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 97750.58364292856,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 82028.2059360721,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 831376.5963695382,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 830201.2503719146,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 666640.7298980021,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 661176.7079693419,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 216.51512685224975,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 668.4235222531742,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 665.0309192951541,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 558.6617231940041,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 555.1028047690035,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "4d55dc298b2bec4757bd80fc0dceecb104e823b1",
          "message": "Parse+Get benchmark: 5 fields instead of 26",
          "timestamp": "2026-03-22T07:47:00-04:00",
          "tree_id": "058f2b9359a7437160651c58f676bd44b3d8a502",
          "url": "https://github.com/lpgauth/torque/commit/4d55dc298b2bec4757bd80fc0dceecb104e823b1"
        },
        "date": 1774180376097,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 164123.68491232907,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 297865.5331207141,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 291508.7673961166,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 270788.5212968952,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 792835.2606492537,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 777902.2030622904,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 659336.9744439729,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 652879.8251613943,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 251.24512533297664,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 760.9798445731492,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 755.4035125642438,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 600.1607466942982,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 597.6899386720219,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "af985cbbe49e7fc5ba39797af75d3480e41efc77",
          "message": "Merge pull request #14 from lpgauth/perf/serde-single-pass-decode\n\nSingle-pass serde decoder: skip intermediate sonic-rs Value DOM",
          "timestamp": "2026-03-22T11:33:06-04:00",
          "tree_id": "3cbb6d84a7acfe503e6a46474a61438a11c28120",
          "url": "https://github.com/lpgauth/torque/commit/af985cbbe49e7fc5ba39797af75d3480e41efc77"
        },
        "date": 1774193943762,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 189478.02122476528,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 291879.87837484555,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 286956.9127790584,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 267997.35378448083,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 776163.150413194,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 725423.0878002102,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 629729.7244229803,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 621845.7291249469,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 387.9986823564748,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 506.0988830818231,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 505.1026291393998,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 428.72043359491084,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 422.50071767430944,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "c0fd7ca74e0063c9473ee41fb5e0b1168a421696",
          "message": "Bump version to 0.1.5",
          "timestamp": "2026-03-22T11:46:33-04:00",
          "tree_id": "b65ec7e870d278e791f087723b42af4f0c0a27e0",
          "url": "https://github.com/lpgauth/torque/commit/c0fd7ca74e0063c9473ee41fb5e0b1168a421696"
        },
        "date": 1774194748861,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190662.35021794177,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 312613.452795063,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 296601.11972635234,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 281982.54975918075,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 775581.2920901085,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 758317.2108459033,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 643040.4578453205,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 642848.5770376071,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 386.92417108590627,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 608.9262417278887,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 607.7436629116514,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 486.4650377913799,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 483.7895857873691,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "6bb6f5cf32bbf54c31514fa48ad7baaba625e27b",
          "message": "Add checksums for v0.1.5",
          "timestamp": "2026-03-22T11:52:30-04:00",
          "tree_id": "32608e8c843a3e0e3fb4ba3178e9504ed99c8557",
          "url": "https://github.com/lpgauth/torque/commit/6bb6f5cf32bbf54c31514fa48ad7baaba625e27b"
        },
        "date": 1774195107972,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190857.1920360487,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 304131.6441704884,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 293770.5068319999,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 278799.80364687426,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 763304.9807743741,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 761119.2862214809,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 646624.0937769437,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 637254.2535233435,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 398.19359696732204,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 605.2883032308459,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 600.9971410922471,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 484.97378452390944,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 481.4674085393985,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "b49e84888d37dc56112840942ea3652cf29fdfcd",
          "message": "Merge pull request #16 from lpgauth/perf/consume-timeslice\n\nAdd enif_consume_timeslice to normal-scheduler NIFs",
          "timestamp": "2026-03-23T09:47:16-04:00",
          "tree_id": "05222e9135d6ad611399b90fb64da0579f940ec3",
          "url": "https://github.com/lpgauth/torque/commit/b49e84888d37dc56112840942ea3652cf29fdfcd"
        },
        "date": 1774273984139,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 191311.44563618983,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 272106.9215370152,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 268359.04536315834,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 238297.17253768208,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 740855.48279157,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 727174.988608004,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 640361.7016986718,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 636163.4397774512,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 387.70464187054546,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 595.947082361373,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 588.6881313320163,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 482.43624265987216,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 482.2370090736403,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "ddd09101bb9662301b77ebd4552d2d858925656c",
          "message": "Bump version to 0.1.6",
          "timestamp": "2026-03-23T09:49:18-04:00",
          "tree_id": "b16d5ff1aedccdbc07e6301f1662cbaa8abece63",
          "url": "https://github.com/lpgauth/torque/commit/ddd09101bb9662301b77ebd4552d2d858925656c"
        },
        "date": 1774274111446,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 192975.6184226326,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 235697.63815945556,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 228694.98287855688,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 209081.7440006017,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 813671.7263421756,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 809260.2484899953,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 656066.1251671821,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 651341.569174474,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 371.68747255810433,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 706.5421724325461,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 706.4240739171747,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 583.1950355276949,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 579.992210790697,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "f63cbc2a4264128d5d8db5a8d0658c44f4e6a873",
          "message": "Add checksums for v0.1.6",
          "timestamp": "2026-03-23T09:56:32-04:00",
          "tree_id": "f7c36a02e894badae2bb62f17d47e3cffa6bd6c8",
          "url": "https://github.com/lpgauth/torque/commit/f63cbc2a4264128d5d8db5a8d0658c44f4e6a873"
        },
        "date": 1774274543519,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190435.94076675162,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 294209.35176764085,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 293689.23902431206,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 267391.155944572,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 780023.5792859767,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 746198.0379819502,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 660931.9548490575,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 655174.8401314588,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 390.7047718849884,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 597.2220411558534,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 589.3443109798827,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 483.3852884451321,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 481.07943046503897,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "11b7f3583465c0f048f3b17670d1c00abfa1f93f",
          "message": "Merge pull request #17 from lpgauth/feat/cpu-variant-builds\n\nAdd x86_64 CPU variant builds (SSE4.2, AVX2)",
          "timestamp": "2026-03-24T13:12:33-04:00",
          "tree_id": "e9445669252f959437868720c871ff4fe27735c7",
          "url": "https://github.com/lpgauth/torque/commit/11b7f3583465c0f048f3b17670d1c00abfa1f93f"
        },
        "date": 1774372714028,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 181710.42028107055,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 269164.6323127493,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 262926.76598797645,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 230691.160745739,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 744104.0641022614,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 733742.1219566677,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 611578.4031853141,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 608340.420037902,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 376.64561728327897,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 548.1699953161046,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 487.36233972162387,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 487.0222542105595,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 485.4447363390756,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "32d3f6c0826b86555d04ea9765621bf65f6f78c4",
          "message": "Bump version to 0.1.7",
          "timestamp": "2026-03-24T13:14:35-04:00",
          "tree_id": "c8151f24d3443b0be5874d8c77ec658a6f32d91a",
          "url": "https://github.com/lpgauth/torque/commit/32d3f6c0826b86555d04ea9765621bf65f6f78c4"
        },
        "date": 1774372849335,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190798.9493118209,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 282081.77261002816,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 275510.713534678,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 244529.21320232432,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 727398.3047870487,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 716727.9648258585,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 624489.5792969514,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 617773.2010613037,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 391.06863614347463,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 596.5305646638438,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 594.9368841842429,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 516.7048073691566,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 477.0426538520278,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "57ef46fdbc85c33d088105d14a9ed5ce91e1866c",
          "message": "Add checksums for v0.1.7",
          "timestamp": "2026-03-24T13:17:34-04:00",
          "tree_id": "3caa2ef15d54b7647c51a07601c7897638177cad",
          "url": "https://github.com/lpgauth/torque/commit/57ef46fdbc85c33d088105d14a9ed5ce91e1866c"
        },
        "date": 1774373012194,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190632.05398171517,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 282067.0537799668,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 271193.5922460467,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 254952.7741619653,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 724979.787037927,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 721108.4192702695,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 622194.5922472192,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 614230.545738969,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 385.18724675840963,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 578.4276076051431,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 571.7081928991093,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 510.32733961180514,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 510.091602312003,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f532df6ab36224144dab3965f1588854e06e4508",
          "message": "Merge pull request #18 from lpgauth/upkeep/rework-bench-page\n\nRework benchmark page",
          "timestamp": "2026-03-24T14:31:52-04:00",
          "tree_id": "6ae18f09965659bc1a777e98851e819dbb245b1c",
          "url": "https://github.com/lpgauth/torque/commit/f532df6ab36224144dab3965f1588854e06e4508"
        },
        "date": 1774377448078,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 750121.8400401121,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 745795.4233617986,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 616414.4029762065,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 616102.1791663459,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 506.8045915238492,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 505.79447076201154,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 418.3577753021891,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 416.6831550379269,
            "unit": "iterations/s"
          },
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 189928.45108495664,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 394.17398144266775,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 306423.8985864687,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 298466.136797983,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 278883.93044973677,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "09efa1ef963d1eefee83e2dc28ea2498929f45aa",
          "message": "Reorder sections: decode, encode, parse+get",
          "timestamp": "2026-03-24T14:58:41-04:00",
          "tree_id": "d80e7833c7ef4df4e8a2c0dc09604a2a9ea1d2de",
          "url": "https://github.com/lpgauth/torque/commit/09efa1ef963d1eefee83e2dc28ea2498929f45aa"
        },
        "date": 1774379072475,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190657.97260579152,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 382.3369226516748,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 739393.822067824,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 730486.3855136042,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 626156.567142255,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 622864.3383283482,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 505.16743386659755,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 503.5426142984953,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 424.93267528719593,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 422.22955447723416,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many_nil (1.2 KB OpenRTB)",
            "value": 295440.24553563737,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get_many (1.2 KB OpenRTB)",
            "value": 292578.6682048697,
            "unit": "iterations/s"
          },
          {
            "name": "parse+get (1.2 KB OpenRTB)",
            "value": 266927.60256313026,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "f999cab22aa0bc208669bb3dc81028995914ff10",
          "message": "Merge pull request #19 from lpgauth/feat/unique-keys-option\n\nAdd unique_keys option to parse/2 for faster lookups",
          "timestamp": "2026-03-28T09:02:06-04:00",
          "tree_id": "b49f80fdf4bea36642aaf2400ae843404a793242",
          "url": "https://github.com/lpgauth/torque/commit/f999cab22aa0bc208669bb3dc81028995914ff10"
        },
        "date": 1774703294569,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 188994.34386062177,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 384.83769808516405,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 785109.2702481328,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 770618.6462993515,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 661757.0579657658,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 660153.4919715446,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 500.2568764989823,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 500.06153861031373,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 452.9455567983017,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 448.8808879805934,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 309295.36156903347,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 291992.9941315017,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1769374.8984268224,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1657678.2214696098,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1537987.024507934,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1446162.3176837084,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1188690.30640517,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1085076.4840194206,
            "unit": "iterations/s"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "committer": {
            "email": "lpgauth@gmail.com",
            "name": "Louis-Philippe Gauthier",
            "username": "lpgauth"
          },
          "distinct": true,
          "id": "f9dd3a937db4ef18f01983b92bb9dadfdf7cb8d2",
          "message": "Bump version to 0.1.8",
          "timestamp": "2026-03-28T09:23:01-04:00",
          "tree_id": "7dc4e2977a22b2c7639c737b2c187f7f0c110ff6",
          "url": "https://github.com/lpgauth/torque/commit/f9dd3a937db4ef18f01983b92bb9dadfdf7cb8d2"
        },
        "date": 1774704545580,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190623.19446482914,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 389.7342540917934,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 780675.762354844,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 762608.0893442597,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 649527.4941769876,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 644964.3976717896,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 503.1375487289166,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 501.17585285916823,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 450.6215809126334,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 449.0296669688936,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 336284.11061010824,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 316946.67348003975,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1798255.4250169774,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1602005.9523940927,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1572652.0859895526,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1431150.5786312097,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1242489.6270101182,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1138039.4110354255,
            "unit": "iterations/s"
          }
        ]
      }
    ]
  }
}