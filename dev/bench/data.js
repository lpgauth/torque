window.BENCHMARK_DATA = {
  "lastUpdate": 1781719985377,
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
          "id": "7632c15642917bbe6362042265025a34954a50ae",
          "message": "Add checksums for v0.1.8",
          "timestamp": "2026-03-28T09:26:45-04:00",
          "tree_id": "566f3cdac266d26f29765b01698dfbefc5dd6a33",
          "url": "https://github.com/lpgauth/torque/commit/7632c15642917bbe6362042265025a34954a50ae"
        },
        "date": 1774704775474,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 190627.29818709035,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 391.0612849346318,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 726526.4461761924,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 719312.1168162762,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 645207.8714170549,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 635064.427216284,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 507.7286301871517,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 503.6147850293047,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 449.5913321931284,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 448.57131837393376,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 360545.34623815696,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 337720.3943156725,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1759694.0542422594,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1630387.4296007473,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1530125.124880397,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1437721.308800494,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1214731.4491451615,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1126017.6061793305,
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
          "id": "3231989208d852fc80ede6489194ba390a68b2cf",
          "message": "Add Torque.get_many_defaults/3 for 0.1.9\n\nVariant of get_many_nil/2 that takes %{path => default} and returns\n%{path => value_or_default}. Saves callers from the awkward two-call\npattern:\n\n  paths = Map.keys(defaults)\n  values = Torque.get_many_nil(doc, paths)\n  Enum.zip(paths, values)\n  |> Map.new(fn {p, nil} -> {p, Map.get(defaults, p)}; pv -> pv end)\n\nNow a single call:\n\n  Torque.get_many_defaults(doc, %{\n    \"/user/id\" => 0,\n    \"/user/name\" => \"anonymous\",\n    \"/created_at\" => nil\n  })\n\nReturns a same-shape map with parsed values, falling back to the\nprovided defaults for missing/null fields. Same nil/missing\nindistinguishability semantics as get_many_nil/2.\n\nPure-Elixir wrapper around the existing NIF (get_many_nil/2); no\nnew Rust code, no NIF dispatch overhead beyond the one\nget_many_nil call. Has an embedded doctest exercised by the test\nsuite.\n\nD1's two other plan items resolved on inspection:\n\n- 'aarch64 baseline variant in release matrix' -- aarch64 v8 is\n  universal across consumer CPUs, no v2 distinction needed. The\n  matrix already ships aarch64-apple-darwin + aarch64-linux-gnu.\n\n- 'property test for float round-trip precision' -- already\n  covered by test/property_test.exs (35 properties, 626 lines)\n  with a json_scalar generator that includes float(-1000..1000),\n  encoded/decoded through the round-trip suite.\n\nREADME and mix.exs version both bumped to 0.1.9.",
          "timestamp": "2026-05-14T15:22:17-04:00",
          "tree_id": "92fd7d6da0fa54185fc477895ca842c6102eea6f",
          "url": "https://github.com/lpgauth/torque/commit/3231989208d852fc80ede6489194ba390a68b2cf"
        },
        "date": 1778786913971,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 174455.57389127006,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 348.0379928018006,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 902052.9191852746,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 898034.7711501936,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 740165.6013653142,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 731815.9401561847,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 666.823962607419,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 666.3142524041424,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 539.0415974956688,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 532.1419500888924,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 294440.7171128634,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 289148.7536334346,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1929482.1842680685,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1696007.667148645,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1661534.7700683197,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1486576.7994421613,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1232401.221212004,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1093518.347364672,
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
          "id": "bdce243105fff4e06742998a46ffbfb641bdc309",
          "message": "Add checksums for v0.1.9",
          "timestamp": "2026-05-14T15:50:02-04:00",
          "tree_id": "aa149d945a441588dcb45da449b00d637fc92136",
          "url": "https://github.com/lpgauth/torque/commit/bdce243105fff4e06742998a46ffbfb641bdc309"
        },
        "date": 1779452071414,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 192235.952949702,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 381.327515310996,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 788902.8500938615,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 779458.2070496067,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 646925.7657406371,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 644286.5499557431,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 503.1375474188386,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 502.0258726432691,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 455.57457037481197,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 451.7792505732395,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 359524.58192128525,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 342490.9277980562,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1857425.6146362524,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1679306.0786199819,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1526758.266920812,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1423751.6245700116,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1209849.9234645308,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1091776.5824386654,
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
          "id": "30cd0d2c7a8c48000f7732a2e1c7780d557abc17",
          "message": "Merge pull request #20 from lpgauth/chore/deps-cleanup\n\nClean up deps list in mix.exs",
          "timestamp": "2026-06-04T10:56:41-04:00",
          "tree_id": "4c1e14ec643108623cc21504ca070fbc704ade38",
          "url": "https://github.com/lpgauth/torque/commit/30cd0d2c7a8c48000f7732a2e1c7780d557abc17"
        },
        "date": 1780585388292,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 194478.76233899267,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 375.84662204457015,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 725576.8536427065,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 698846.9448212851,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 636497.1097496875,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 614304.1454987134,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 519.5287041005437,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 519.0549174382668,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 461.49545672278487,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 460.9541265998278,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 364847.20247867296,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 347425.60999967175,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1748567.8385718113,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1649568.300140404,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1576962.2841478665,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1402191.0115130849,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1239035.2381968673,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1114746.327372635,
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
          "id": "ab43d4cfec4bbc2d44dfd4840345c9519506c27a",
          "message": "Merge pull request #21 from lpgauth/chore/upgrade-deps\n\nUpgrade deps to latest versions",
          "timestamp": "2026-06-15T09:33:58-04:00",
          "tree_id": "6dd4411a97e37a4a11e680b7d5d0b3a1ad684d1c",
          "url": "https://github.com/lpgauth/torque/commit/ab43d4cfec4bbc2d44dfd4840345c9519506c27a"
        },
        "date": 1781530818485,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 176839.0397054074,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 318.33021927913444,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 831435.610652266,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 828360.683460221,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 702679.2523969171,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 701141.0980924253,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 633.756341676075,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 632.8752301162125,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 523.9873913328488,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 523.5356823384114,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 279245.97890195483,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 268347.76904924156,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1876235.678263879,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1662087.916402948,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1618388.3223248536,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1446474.1874902078,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1279774.2109716872,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1132065.3873450817,
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
          "id": "685225c48e27d924c29d408019dc983990086fce",
          "message": "Merge pull request #24 from lpgauth/fix/decode-deep-nesting-segfault\n\nLower nesting depth limit to 128 to fix segfault",
          "timestamp": "2026-06-15T09:34:26-04:00",
          "tree_id": "a7944b4ae7e5cefa503833c0faca8bc7d4492bea",
          "url": "https://github.com/lpgauth/torque/commit/685225c48e27d924c29d408019dc983990086fce"
        },
        "date": 1781530839733,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 195131.4511959725,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 387.02764468801035,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 715881.2950606471,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 710314.8770516441,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 625366.2492615652,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 611839.8449979621,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 483.6957549673127,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 476.9254311321054,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 415.89826516981395,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 411.42688163873527,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 316447.7009911394,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 290272.69216110493,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1826442.1685534164,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1671143.2220761322,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1593787.3302845203,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1471925.7959108294,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1329007.5925924673,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1188576.9506320225,
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
          "id": "2c0c4f1aca9cf1e59c972c0a6e7d14600c9bd871",
          "message": "Merge pull request #25 from lpgauth/bench/add-glazer\n\nAdd glazer to comparison benchmark",
          "timestamp": "2026-06-15T10:28:23-04:00",
          "tree_id": "ef521d86d4dd28f417244f41fac896ad3e295829",
          "url": "https://github.com/lpgauth/torque/commit/2c0c4f1aca9cf1e59c972c0a6e7d14600c9bd871"
        },
        "date": 1781534167442,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 193625.4404017151,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 352.89093674780327,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 796157.3814294556,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 782615.7108832992,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 660403.6585678507,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 656702.3295871575,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 450.674744020209,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 428.07444198520875,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 424.69368659850994,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 396.60585073672473,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 274100.6785722192,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 253280.255446835,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1708759.0203060498,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1644624.664096308,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1495135.2179882552,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1398009.7921414995,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1266516.7863102646,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1087528.364248685,
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
          "id": "5eb30699bcbb0298d27dc9ceee0aa0fd6e5e2f0e",
          "message": "Merge pull request #26 from lpgauth/perf/faster-decode\n\nSkip zero-init of decode stack buffers",
          "timestamp": "2026-06-15T11:01:23-04:00",
          "tree_id": "66e3d0349a8958ef868ffae418c0fcfbe2208e63",
          "url": "https://github.com/lpgauth/torque/commit/5eb30699bcbb0298d27dc9ceee0aa0fd6e5e2f0e"
        },
        "date": 1781536089704,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 210309.22071564547,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 388.41332537363627,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 741632.9532006861,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 721421.4005410741,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 630166.2406900421,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 615105.3874423015,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 485.56629295411193,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 484.76262707099056,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 436.76018538058275,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 435.8859974568,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 325698.6559997082,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 323731.6881118013,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1826312.1481148503,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1674048.28772867,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1475278.6342159559,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1377970.6475523508,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1296179.6283681132,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1093209.4349230386,
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
          "id": "38fb5e053800c417d77b1199a1818a47b947ebf6",
          "message": "Sync Cargo.lock to 0.1.10",
          "timestamp": "2026-06-15T12:55:19-04:00",
          "tree_id": "c30f7b6a60274ef86f4b61f2beb1858553326e5b",
          "url": "https://github.com/lpgauth/torque/commit/38fb5e053800c417d77b1199a1818a47b947ebf6"
        },
        "date": 1781542928681,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 209464.288855578,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 393.51647662710366,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 717115.5495671307,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 709691.368041065,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 617499.7053955218,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 608755.9516212684,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 474.08087606689594,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 472.6486345863495,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 429.2177112428398,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 427.80788667018106,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 333893.11136721185,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 331242.7955685692,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1767123.399677808,
            "unit": "iterations/s"
          },
          {
            "name": "get_many unique_keys (1.2 KB OpenRTB)",
            "value": 1605774.1170781085,
            "unit": "iterations/s"
          },
          {
            "name": "get_many_nil (1.2 KB OpenRTB)",
            "value": 1470532.915143379,
            "unit": "iterations/s"
          },
          {
            "name": "get_many (1.2 KB OpenRTB)",
            "value": 1373168.8537582434,
            "unit": "iterations/s"
          },
          {
            "name": "get unique_keys (1.2 KB OpenRTB)",
            "value": 1213653.6388760416,
            "unit": "iterations/s"
          },
          {
            "name": "get (1.2 KB OpenRTB)",
            "value": 1043644.6679245764,
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
          "id": "8c07e1fbbaef0d2a41f1b210472ca4adc44a3f48",
          "message": "Merge pull request #27 from lpgauth/feat/0.2-vendored-sonic\n\n0.2.0: fused decoder + bounded parser (vendored sonic-rs)",
          "timestamp": "2026-06-15T14:07:46-04:00",
          "tree_id": "497f3310f79200ff9716c40b3c82da0c73992a8b",
          "url": "https://github.com/lpgauth/torque/commit/8c07e1fbbaef0d2a41f1b210472ca4adc44a3f48"
        },
        "date": 1781547275762,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 240110.09514636485,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 414.0206208766516,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 861939.0081493893,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 829730.3482241863,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 711380.9006419823,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 695464.9131514787,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 644.9878539535799,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 639.3235234157916,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 526.0675091760983,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 525.9973597371311,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 250041.21173000702,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 233148.76788032675,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 203053.05128263976,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 202764.26489777284,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 196101.98102603378,
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
          "id": "3620f05fe72ec96326bd506c8b47108f483e451f",
          "message": "Add checksums for v0.2.0",
          "timestamp": "2026-06-15T14:13:34-04:00",
          "tree_id": "06deef19b7bca0239250a8e067156c3dd1a1a706",
          "url": "https://github.com/lpgauth/torque/commit/3620f05fe72ec96326bd506c8b47108f483e451f"
        },
        "date": 1781547615649,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 255781.48256451712,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 451.760017644794,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 781377.6575748062,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 770602.3192482019,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 638011.7764570985,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 636870.1453852708,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 643.8843112350429,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 633.967887258879,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 517.0560438443155,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 513.1967495331622,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 343293.8797223486,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 335268.5062807586,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 270231.0795332307,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 268981.2408477502,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 250905.88805619732,
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
          "id": "cf4c0ec9d782825f1ea9005fbedc777412a6d9fe",
          "message": "Merge pull request #28 from lpgauth/feat/bignum-decode\n\nDecode out-of-range integers as exact bignums",
          "timestamp": "2026-06-16T08:14:50-04:00",
          "tree_id": "61b27c3f914fdad9dbbb47ab679806e4b69b6493",
          "url": "https://github.com/lpgauth/torque/commit/cf4c0ec9d782825f1ea9005fbedc777412a6d9fe"
        },
        "date": 1781612961919,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 271347.1807874248,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 479.13747623288566,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 735704.9542270827,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 734721.6085235489,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 635975.4136713048,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 626666.9407206532,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 480.6789642862849,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 479.4624731073074,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 413.5160817988188,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 412.0585190235723,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 331183.95037853386,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 321948.916892709,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 266897.10099745146,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 266377.63755342836,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 243246.8025093484,
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
          "id": "b4bcee20b019fc919de1f6d02fc3cee62ae1b5d3",
          "message": "Add checksums for v0.2.1",
          "timestamp": "2026-06-16T09:06:19-04:00",
          "tree_id": "2dfd064a99135ba31350fc93540ceb115cfa3fe3",
          "url": "https://github.com/lpgauth/torque/commit/b4bcee20b019fc919de1f6d02fc3cee62ae1b5d3"
        },
        "date": 1781615646633,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 254917.76434113662,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 434.1467989254142,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 743399.4002143616,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 734548.1569881904,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 664347.5352737333,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 658809.3410457736,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 476.1113288076882,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 474.3660602244522,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 429.08795659298016,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 428.3721473606008,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 336473.3932136727,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 322737.4706900278,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 270025.7280378662,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 255790.70888246555,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 248561.43954550594,
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
          "id": "5f73831a2bf03d270a54e78b994b004eafe79157",
          "message": "Merge pull request #30 from lpgauth/encode-thread-local-buffer\n\nReuse a thread-local scratch buffer in the JSON encoder",
          "timestamp": "2026-06-17T13:34:18-04:00",
          "tree_id": "d89d45042cb89f54a38c83947c41bbb269168b42",
          "url": "https://github.com/lpgauth/torque/commit/5f73831a2bf03d270a54e78b994b004eafe79157"
        },
        "date": 1781718052280,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 271345.2177710581,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 467.4152788706357,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 769409.2029190181,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 747502.7189962902,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 637730.4688880238,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 631915.5862287718,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 582.6992093335406,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 578.6475723678438,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 527.5596691663825,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 476.2086015588036,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 323576.0912037499,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 317389.4786476474,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 266496.71467620437,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 260281.91404282604,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 248250.23157824253,
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
          "id": "db4ddb14a854f1098b0ac2f54d98ff2cd893e11b",
          "message": "Bump version to 0.2.2",
          "timestamp": "2026-06-17T13:36:20-04:00",
          "tree_id": "cb19dd6263596c5b45f3d9a5a11f3a9f02999107",
          "url": "https://github.com/lpgauth/torque/commit/db4ddb14a854f1098b0ac2f54d98ff2cd893e11b"
        },
        "date": 1781718230714,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 254660.01502007688,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 432.8881651205033,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 793982.2112779503,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 781563.5443655073,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 643569.9100935089,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 624731.2425717307,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 625.0203008976096,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 623.3035330445861,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 510.81330200536974,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 507.4096221471766,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 337521.7529352359,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 333305.55664815893,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 270803.5628483056,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 263765.5175466306,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 249202.98238742945,
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
          "id": "23a050547f98c9c34f0db6be64665a1b883308b1",
          "message": "Add checksums for v0.2.2",
          "timestamp": "2026-06-17T13:39:50-04:00",
          "tree_id": "8c7e395cdc7fa76d0ba90707c5ec5168692ed244",
          "url": "https://github.com/lpgauth/torque/commit/23a050547f98c9c34f0db6be64665a1b883308b1"
        },
        "date": 1781718395303,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 268173.43342858466,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 453.8000787302719,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 772536.8418339157,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 752066.841185933,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 649523.1576400992,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 640508.4542625998,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 535.4564776109851,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 533.6896554405604,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 512.7468154572153,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 507.1826862627109,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 337645.1943721888,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 326562.940749755,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 277353.0180252001,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 265879.5216927482,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 254611.4146229394,
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
          "id": "e2a0605d16ed1c19d562183715e0aafef0851856",
          "message": "Merge pull request #29 from lpgauth/pgo-build-tooling\n\nAdd profile-guided optimisation build pipeline",
          "timestamp": "2026-06-17T14:01:18-04:00",
          "tree_id": "0b398a4b3acc8d8163d0d17b80a14a8f45709013",
          "url": "https://github.com/lpgauth/torque/commit/e2a0605d16ed1c19d562183715e0aafef0851856"
        },
        "date": 1781719715964,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 227539.60594257354,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 414.08076040673825,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 544021.4467703527,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 533108.4491397443,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 451174.92743542715,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 440726.1891960068,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 412.48981342138813,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 406.0683469373131,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 361.53006161738205,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 337.44961525984337,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 291551.0950715546,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 281680.34527220705,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 214179.75666154586,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 205122.21093921404,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 202256.13756373196,
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
          "id": "faaa403b8a2d0557d0401998c7d4fa6d003b2fef",
          "message": "Bump version to 0.2.3",
          "timestamp": "2026-06-17T14:02:28-04:00",
          "tree_id": "ddf7775435b3b1e89d00f3132fb90acd6cc58da6",
          "url": "https://github.com/lpgauth/torque/commit/faaa403b8a2d0557d0401998c7d4fa6d003b2fef"
        },
        "date": 1781719795066,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 215837.61501238088,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 404.58119881051636,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 555994.8078246953,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 533903.6680249267,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 461298.40929800645,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 458673.5252375753,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 433.0133249885253,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 430.2279182827262,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 369.88981347742714,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 368.28848700106073,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 296115.75140796386,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 285272.5067603472,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 219451.7498415358,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 219201.53546876932,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 205176.14738336264,
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
          "id": "866a7dbef674a1fd990d36a2b3e2ee39cd23f2b3",
          "message": "Add checksums for v0.2.3",
          "timestamp": "2026-06-17T14:05:30-04:00",
          "tree_id": "c9a8af0d16211676afffcf6ce5abfb41cd9928a0",
          "url": "https://github.com/lpgauth/torque/commit/866a7dbef674a1fd990d36a2b3e2ee39cd23f2b3"
        },
        "date": 1781719984361,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 218320.7211919725,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 386.2532785412315,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 538981.3970058791,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 535420.1449132077,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 459409.24486184824,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 446605.7345402695,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 441.2596480848957,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 440.9947133765951,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 376.8960398540113,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 375.45154051769754,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 299455.74714508664,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 283147.4744156168,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 228018.73788761473,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 225460.72011531284,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 204445.64725709165,
            "unit": "iterations/s"
          }
        ]
      }
    ]
  }
}