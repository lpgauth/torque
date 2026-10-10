window.BENCHMARK_DATA = {
  "lastUpdate": 1791594017807,
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
        "date": 1781721858963,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 223563.27822160572,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 427.21759683648315,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 531235.456466515,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 515452.6086549577,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 441679.2943402631,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 437755.8776401528,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 402.01069428608696,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 400.82544647017994,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 334.9411293403544,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 334.90152957306265,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 267625.40413199004,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 256712.08610626112,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 210583.38391942316,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 202453.51357204697,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 194189.3095810146,
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
          "id": "9332884719984f53cded06a8a61d52f62e8c33d4",
          "message": "Merge pull request #31 from lpgauth/update-readme-pgo-benchmarks\n\nUpdate README benchmark numbers from PGO build",
          "timestamp": "2026-06-17T15:15:34-04:00",
          "tree_id": "0ac996ea24fa21526690e17a3a2fe0ecb57b79b3",
          "url": "https://github.com/lpgauth/torque/commit/9332884719984f53cded06a8a61d52f62e8c33d4"
        },
        "date": 1781724160321,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 220742.1053478334,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 424.49705870549064,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 549916.5417785578,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 538320.0726670945,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 455032.53709246416,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 449649.8972167108,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 410.2898160070431,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 409.4329044645788,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 361.0170008208874,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 337.2898049994663,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 283405.0260146358,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 277433.46920201916,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 215912.7901326853,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 213876.7050368632,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 201145.97322144895,
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
          "id": "762b61137df2b37ebad3e210d051bab4f00e86bb",
          "message": "Merge pull request #32 from lpgauth/fix-bench-pgo-rebuild\n\nForce PGO rebuild in bench CI to use the optimized NIF",
          "timestamp": "2026-06-17T15:17:56-04:00",
          "tree_id": "0183a1d20a0035a1b167fc28a836babc7e6714fa",
          "url": "https://github.com/lpgauth/torque/commit/762b61137df2b37ebad3e210d051bab4f00e86bb"
        },
        "date": 1781724322437,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 282514.00061342545,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 468.4067216364555,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 890196.5567706376,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 879206.1509100544,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 700485.8684863504,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 694569.8032000988,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 641.3399558506981,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 637.2889588065242,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 528.6888583914402,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 524.3578301073206,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 286335.74628189934,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 277203.8115008482,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 257154.93503420558,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 257084.63231417435,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 238791.026079363,
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
          "id": "03ac63c32b8a72dc05343e1875ec9c9807e7345e",
          "message": "Merge pull request #33 from lpgauth/bench-pgo-glazer\n\nPGO-build glazer in bench CI and bump to 0.5.11",
          "timestamp": "2026-06-18T10:32:55-04:00",
          "tree_id": "a58a4954837fbe978bf5911ee5321bbac5c34286",
          "url": "https://github.com/lpgauth/torque/commit/03ac63c32b8a72dc05343e1875ec9c9807e7345e"
        },
        "date": 1781793642305,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 269967.1260814597,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 455.7451961844136,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 879516.0064226198,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 871250.7049126094,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 710888.242781364,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 706262.6572685557,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 732.6621246943872,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 727.4174481599167,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 604.4549693920752,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 603.698205566333,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 322204.2976534592,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 311604.586595284,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 274671.57205630274,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 266260.4844515631,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 259278.14379246527,
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
          "id": "34038ba18f6e082a85abc9bb2560fa3e1df86d81",
          "message": "Merge pull request #34 from lpgauth/compiled-pointers\n\nAdd compiled pointers and fused parse_get_many_nil",
          "timestamp": "2026-06-23T12:39:03-04:00",
          "tree_id": "4bd65f063b31a0fc23faa876d0dd62b303daf112",
          "url": "https://github.com/lpgauth/torque/commit/34038ba18f6e082a85abc9bb2560fa3e1df86d81"
        },
        "date": 1782233190449,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 281935.22793289623,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 460.15365110203896,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 887758.506377278,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 859253.7753361791,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 678745.257995464,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 669274.7079493654,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 645.3938614270187,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 641.0944632010672,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 529.1663109284575,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 529.0706231332545,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 325379.157930902,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 315593.6924794498,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 278770.16137625236,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 277031.9739982177,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 266576.17521583673,
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
          "id": "10cec25321a63f047c696d74312be2c6fb29b3b4",
          "message": "Add checksums for v0.2.4",
          "timestamp": "2026-06-23T12:48:33-04:00",
          "tree_id": "6e11b694674cabf6005baaa68a0b97069be667b8",
          "url": "https://github.com/lpgauth/torque/commit/10cec25321a63f047c696d74312be2c6fb29b3b4"
        },
        "date": 1782233768312,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 269753.568319017,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 438.967212004951,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 867081.2377446629,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 841151.6118565238,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 700096.7180815643,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 692960.6424687583,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 707.9270613524609,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 688.1120811408916,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 584.8640243172533,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 580.43260804344,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 358595.8532173479,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 311349.37462412874,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 290462.82357345783,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 287141.6301678021,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 231038.5211120019,
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
          "id": "b19f2d0d3c5a5fd506680bbd7c1e1d2601311494",
          "message": "Merge pull request #35 from lpgauth/decode-buffer-reuse\n\nReuse decode value/frame stacks across calls",
          "timestamp": "2026-06-25T17:31:08-04:00",
          "tree_id": "b7d02fbd31cb689de94e6c10c5be93fa70f492fd",
          "url": "https://github.com/lpgauth/torque/commit/b19f2d0d3c5a5fd506680bbd7c1e1d2601311494"
        },
        "date": 1782423523799,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 270132.0750082075,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 467.39465903193076,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 921109.6194191144,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 918667.4552544849,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 667298.3659994367,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 667246.823099922,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 759.9072325909681,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 753.6630169512505,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 608.4094517788517,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 606.258203038513,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 373044.1570432593,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 355903.15632959764,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 306942.4700932784,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 303904.31821985514,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 283129.84870854893,
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
          "id": "8f5edf5cc7c496e25f1a3e52e1249cc165c0bcfc",
          "message": "Merge pull request #36 from lpgauth/pgo-workload-compiled-pointers\n\nCover compiled-pointer path in PGO workload",
          "timestamp": "2026-06-25T17:32:29-04:00",
          "tree_id": "cda6742fd7326869ae5194f37d58fc079e1ebf84",
          "url": "https://github.com/lpgauth/torque/commit/8f5edf5cc7c496e25f1a3e52e1249cc165c0bcfc"
        },
        "date": 1782423599213,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 278074.06824650674,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 465.1222531981529,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 875703.3296673299,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 858997.3981656007,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 692616.5049132043,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 678085.5468087749,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 652.3915169950226,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 643.5445193638645,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 536.5327574984035,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 532.3955720796823,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 347590.24183914333,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 337798.40809041134,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 282664.56650361104,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 280625.99537128524,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 269402.45187007735,
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
          "id": "4ae2e1639552a03462e2a2622a3e43d048677e93",
          "message": "Merge pull request #37 from lpgauth/bignum-encode\n\nEncode arbitrary-precision integers (bignums)",
          "timestamp": "2026-06-25T19:30:56-04:00",
          "tree_id": "5c8e1bc2757fb3d92c3deaa53fa2359d48cc05d5",
          "url": "https://github.com/lpgauth/torque/commit/4ae2e1639552a03462e2a2622a3e43d048677e93"
        },
        "date": 1782430707369,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 287276.48687786993,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 510.4837749818285,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1086074.3637397608,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1067204.6778415525,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 895308.3877072844,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 881938.342221186,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 948.8361456756904,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 947.7379658566381,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 677.306790387031,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 672.2347802089347,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 311588.47692742577,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 277786.3487212418,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 276970.46856443567,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 271950.0977183737,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 256870.02114537318,
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
          "id": "361ee81bfe4a06e5936ce5a9f54f5400a8cff548",
          "message": "Merge pull request #38 from lpgauth/remove-simdjsone-bench\n\nRemove simdjsone from benchmarks",
          "timestamp": "2026-06-26T08:20:20-04:00",
          "tree_id": "4830ef4fa07012f015c1c37e9a6de565b7bd1a69",
          "url": "https://github.com/lpgauth/torque/commit/361ee81bfe4a06e5936ce5a9f54f5400a8cff548"
        },
        "date": 1782476817181,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 271869.2730737627,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 472.1493443315172,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 851449.5183030781,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 835704.997259155,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 661567.9873279139,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 658814.3788675801,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 613.3246186265875,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 611.4589734079225,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 525.6846547571795,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 516.1454792656014,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 324656.9286439933,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 309653.4580426221,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 285256.5692988333,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 283004.69822636934,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 264864.4751690467,
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
          "id": "7268a175c7affdfdb40b2767878153003f7e404b",
          "message": "Merge pull request #39 from lpgauth/docs-comment-fixes\n\nFix stale doc comments and parse/2 typespec",
          "timestamp": "2026-06-26T08:26:47-04:00",
          "tree_id": "80eda543dd7d81d54c666e29bd4942b36a3e7a86",
          "url": "https://github.com/lpgauth/torque/commit/7268a175c7affdfdb40b2767878153003f7e404b"
        },
        "date": 1782477199611,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 254714.33025756336,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 463.9629819370134,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 967385.1195393051,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 954513.242239973,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 780294.9573773126,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 774679.3297030702,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 992.944642952313,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 988.9621880136964,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 751.6148494092738,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 741.9038819759585,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 297428.85390576185,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 288900.1880898253,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 262884.6784138459,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 255124.0989630717,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 248049.86796728452,
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
          "id": "d25dc959dcf7ba8ddf3dfeaada0a12d1b97dd2d5",
          "message": "Merge pull request #40 from lpgauth/fix-encoder-improper-lists-atom-utf8\n\nFix improper-list truncation and atom UTF-8 encoding bugs",
          "timestamp": "2026-07-01T16:07:39-04:00",
          "tree_id": "15f7a04a085d832f92745206774b3a60bc1ab7e7",
          "url": "https://github.com/lpgauth/torque/commit/d25dc959dcf7ba8ddf3dfeaada0a12d1b97dd2d5"
        },
        "date": 1782936862464,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 270184.008694837,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 462.3492843541007,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 813338.5869041565,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 803788.7353678751,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 677138.4099376812,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 668349.810759391,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 749.5296746347551,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 743.3433998550641,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 595.4989368786672,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 594.6535386860346,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 352577.9633869934,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 334591.0474740858,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 292084.6413949684,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 286934.79129660083,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 278337.7189676329,
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
          "id": "2b53773f5fe90871b75ca7a73bb82e0dc317f5f8",
          "message": "Merge pull request #41 from lpgauth/encode-dirty-option\n\nAdd opt-in dirty scheduler dispatch to encode",
          "timestamp": "2026-07-01T16:48:27-04:00",
          "tree_id": "3b9b8494280e2479d33de00347aa110855b2fca4",
          "url": "https://github.com/lpgauth/torque/commit/2b53773f5fe90871b75ca7a73bb82e0dc317f5f8"
        },
        "date": 1782939311320,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 275613.97768559615,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 467.63612601306124,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 736799.7793732636,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 722239.8495691108,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 608620.5748567398,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 604527.898483729,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 626.6766916137692,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 622.9302213257477,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 525.3205474849906,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 524.565393157011,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 302962.02053204883,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 283251.60449131834,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 255062.04702228657,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 250903.96798106877,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 242052.42320308674,
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
          "id": "8fb016d3340478577f59fd39f9911a136d7deae7",
          "message": "Merge pull request #42 from lpgauth/get-timeslice-accounting\n\nReport get-family term building to the scheduler",
          "timestamp": "2026-07-01T17:25:04-04:00",
          "tree_id": "dfeb8b2b2dc7c2e95be3039e850bbbd2cbc0664d",
          "url": "https://github.com/lpgauth/torque/commit/8fb016d3340478577f59fd39f9911a136d7deae7"
        },
        "date": 1782941498339,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 275015.6498480593,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 478.8716251162916,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 800329.7038247876,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 785955.5156723303,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 651513.0036643351,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 645730.6697979817,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 633.2294149058355,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 632.9820637717811,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 519.4479419849664,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 515.6860852914468,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 343189.94956536783,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 335702.285554116,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 290312.48890543607,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 288710.3274795282,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 263168.30955343787,
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
          "id": "22a1a384ec16d5e529f38c2ac13bd8b1cc8303f2",
          "message": "Merge pull request #43 from lpgauth/pointer-badarg-cleanups\n\nRaise badarg on invalid paths; version sync and dedup",
          "timestamp": "2026-07-01T17:25:58-04:00",
          "tree_id": "751c6f50f0cd372c87d04da2ae48639ade25a464",
          "url": "https://github.com/lpgauth/torque/commit/22a1a384ec16d5e529f38c2ac13bd8b1cc8303f2"
        },
        "date": 1782941553588,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 278693.2562488373,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 462.931697494307,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 792135.5910341521,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 784447.2501019656,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 651510.3087205703,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 642845.1528307748,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 630.2241453753556,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 628.7897589311539,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 561.8640630907457,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 513.8882844173121,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 334553.5095331253,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 331286.35667750397,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 286806.1447434104,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 280125.9082255853,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 259857.73433492344,
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
          "id": "93961da416e4bd6e5cd72309180073dd37b9f7fb",
          "message": "Merge pull request #44 from lpgauth/decode-key-cache\n\nDedup repeated object keys during decode",
          "timestamp": "2026-07-01T17:38:50-04:00",
          "tree_id": "b99bb6d8a6b8eadf17da680df16efd43e667ed8e",
          "url": "https://github.com/lpgauth/torque/commit/93961da416e4bd6e5cd72309180073dd37b9f7fb"
        },
        "date": 1782942321599,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 258419.58730955262,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 489.20221623674183,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 790470.5486996771,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 787589.1909514136,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 666587.0521755031,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 658335.5232261039,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 640.211452394751,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 638.4605072393654,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 543.9958606435957,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 534.4548670549824,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 345302.41989938624,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 335864.6794811507,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 295094.47103344323,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 285137.25182840484,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 270729.7649736378,
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
          "id": "a7fd0d9904bd90ff46e8bcfc15434562ea62c5e0",
          "message": "Merge pull request #45 from lpgauth/avx2-escape\n\nAdd AVX2 escape kernels with runtime dispatch",
          "timestamp": "2026-07-01T18:09:17-04:00",
          "tree_id": "1e3ee40d89dc81476ded13d2ceb737b5b0d2055d",
          "url": "https://github.com/lpgauth/torque/commit/a7fd0d9904bd90ff46e8bcfc15434562ea62c5e0"
        },
        "date": 1782944151922,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 250973.2832392099,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 478.6909155636148,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 751673.301628019,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 741874.2294935983,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 637841.3826982108,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 612598.4253849712,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 726.1490556787501,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 721.5729168707144,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 589.0562360715846,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 588.816748360911,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 377127.80860113545,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 357970.18018047424,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 297758.91136026167,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 286276.56167265354,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 275760.32200281305,
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
          "id": "5bdb111c41e99aa856034578bf42badfc38d089d",
          "message": "Merge pull request #46 from lpgauth/bench-glazer-validate-utf8\n\nBenchmark glazer with UTF-8 validation enabled",
          "timestamp": "2026-07-01T18:40:10-04:00",
          "tree_id": "00889b816a107220200f73441b4b3cf150f19cff",
          "url": "https://github.com/lpgauth/torque/commit/5bdb111c41e99aa856034578bf42badfc38d089d"
        },
        "date": 1782946010637,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 249022.14283777037,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 462.58687399500906,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 779674.7305554845,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 684411.6497925625,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 629863.1628514351,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 599353.1562573122,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 719.7524745813332,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 700.3426759490236,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 587.6065876907289,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 584.3735474431031,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 359770.1007895038,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 343224.18589935434,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 300296.0644123911,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 297048.16516079736,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 283563.2997761443,
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
          "id": "b9980650c799b622e324bbaea106de311a40534d",
          "message": "Bump version to 0.2.5",
          "timestamp": "2026-07-01T18:42:46-04:00",
          "tree_id": "bd525012809c7adceb9ab19bee71a3a12f137013",
          "url": "https://github.com/lpgauth/torque/commit/b9980650c799b622e324bbaea106de311a40534d"
        },
        "date": 1782946113937,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 416517.0592925296,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 875.3119982709276,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1484242.376797942,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1441111.6361625222,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1213674.920505294,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1201687.4956221774,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1432.93002753439,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1404.1678694453708,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1245.5208990268145,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1233.405719325976,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 513567.89738348074,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 466484.134876672,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 468964.67385530984,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 455523.3609156403,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 447134.9528316891,
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
          "id": "df626ecc2ca14e7a0f241a84e6cc28829a7050fc",
          "message": "Add checksums for v0.2.5",
          "timestamp": "2026-07-01T18:49:26-04:00",
          "tree_id": "d8bd46310ed7b3e8e911956e5a29642099a59de2",
          "url": "https://github.com/lpgauth/torque/commit/df626ecc2ca14e7a0f241a84e6cc28829a7050fc"
        },
        "date": 1782946578765,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 251490.7920210126,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 451.0301510047706,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 753325.8702494467,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 725210.7232288602,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 641199.9997465977,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 629435.3238776453,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 695.0292986727427,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 694.0687881122814,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 589.7254033459325,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 579.385509614451,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 337239.69766110374,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 324077.8280656041,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 281320.8250847676,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 278974.39030189544,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 259333.20219562144,
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
          "id": "e955c32fbad4267daaffeeb03ea40777f7d55c34",
          "message": "Bump README install snippet to 0.2.5\n\nThe install snippet was missed in the 0.2.5 bump; add README.md to\nthe version-bump checklist in CLAUDE.md so it is included next time.",
          "timestamp": "2026-07-01T19:05:53-04:00",
          "tree_id": "93e5ecc0ce3242ba5bc1a27289e2b2496b8f3cc9",
          "url": "https://github.com/lpgauth/torque/commit/e955c32fbad4267daaffeeb03ea40777f7d55c34"
        },
        "date": 1782947555272,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 242464.72721528533,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 456.9077451284825,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 764463.1337401482,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 757309.8460086386,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 625765.7056904541,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 623684.8311189832,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 718.356150901014,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 702.0265811199795,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 596.7833165429352,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 587.8354356895414,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 342344.4938325294,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 333185.0705304766,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 304972.71463559783,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 296858.0328796793,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 290470.88091884553,
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
          "id": "de855627005bed8cfadbdfeb891f9dba068d66ec",
          "message": "Document single-commit convention for version bumps\n\nVersion bumps land as one \"Bump version to x.y.z\" commit touching\nmix.exs, Cargo.toml, Cargo.lock, and README.md (see faaa403).",
          "timestamp": "2026-07-01T19:06:59-04:00",
          "tree_id": "faf6f2563f1efc36612d7318007b4d152d379708",
          "url": "https://github.com/lpgauth/torque/commit/de855627005bed8cfadbdfeb891f9dba068d66ec"
        },
        "date": 1782947616231,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 250389.3179562189,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 449.21920136087147,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 807739.2998211555,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 778762.9366015837,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 656130.9097588838,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 653510.8805199421,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 725.588001569359,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 711.5358976728548,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 599.322291157346,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 589.9834960375151,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 349975.0299290684,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 347672.1643266366,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 293209.6689887729,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 293121.0705933347,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 278996.28366180905,
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
          "id": "fb6c92dabdcebb82f869e5af53506879bf4e7de8",
          "message": "Merge pull request #48 from lpgauth/encode-integer-keys\n\nSupport integer map keys and add encode_to_iodata!",
          "timestamp": "2026-08-04T15:13:12-04:00",
          "tree_id": "3aaa3b79b5eb951184a80ce867f4aa957e635665",
          "url": "https://github.com/lpgauth/torque/commit/fb6c92dabdcebb82f869e5af53506879bf4e7de8"
        },
        "date": 1785871216138,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 252916.91550919606,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 485.25549915669404,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 780459.1217489757,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 748721.7462960795,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 636549.2447487707,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 630215.2879264365,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 712.5150172002027,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 708.7569609393668,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 602.165905883695,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 600.1247770708853,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 356227.5832928272,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 346192.0539594433,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 287309.85995439155,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 285607.8389382933,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 271671.14288568345,
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
          "id": "1fd95461c0ebb53ca193dd79f93c516c2511b32b",
          "message": "Bump version to 0.2.6",
          "timestamp": "2026-08-04T15:14:39-04:00",
          "tree_id": "a9d54258eb3bce43a2b646c45c5305631787656f",
          "url": "https://github.com/lpgauth/torque/commit/1fd95461c0ebb53ca193dd79f93c516c2511b32b"
        },
        "date": 1785871302090,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 280942.7348799021,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 562.2172513155926,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 888591.8180317221,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 862951.0227219603,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 769772.9540739069,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 767413.469200716,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 846.1610703895874,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 837.5766757910525,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 698.5826333178512,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 698.0537268994938,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 301131.1719347757,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 294170.8215495685,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 271219.9500039219,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 269124.23743647325,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 251974.71786370053,
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
          "id": "01e88c76a4e3ca4bfb396d6cb18e22475c31fcdd",
          "message": "Add checksums for v0.2.6",
          "timestamp": "2026-08-04T15:18:09-04:00",
          "tree_id": "51399fe62fbf95f9f642286e0fba97dae8fc10ae",
          "url": "https://github.com/lpgauth/torque/commit/01e88c76a4e3ca4bfb396d6cb18e22475c31fcdd"
        },
        "date": 1785871509278,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 252223.11738280416,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 469.73974785683123,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 766227.76289895,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 757202.5037797316,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 631435.1019324549,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 607766.9604233515,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 706.8842062507656,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 689.3951159251376,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 607.9329300559164,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 597.5013015605049,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 342495.47628464346,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 329129.7596832367,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 288775.62682700256,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 287013.7665375312,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 269546.5528558891,
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
          "id": "0563af197a2dbfb06d1a5010fd33c5359b48c8ac",
          "message": "Merge pull request #49 from lpgauth/fix-source-build-packaging\n\nShip vendored sonic-rs in the Hex package",
          "timestamp": "2026-08-05T08:14:40-04:00",
          "tree_id": "9b71d822049c0e5accf57c89f69c26d4f22d6d6e",
          "url": "https://github.com/lpgauth/torque/commit/0563af197a2dbfb06d1a5010fd33c5359b48c8ac"
        },
        "date": 1785932482519,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 252540.8400984241,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 502.9283388628817,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 747306.0373999096,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 736237.6272791136,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 642517.6774539311,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 617265.0855483639,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 634.6046581453373,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 631.5505703172171,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 534.7241391678882,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 532.712473768007,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 324054.38187438576,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 315699.207571059,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 281169.8041246221,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 272639.81822627835,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 259771.073042741,
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
          "id": "061c2e0d695a9503a3f3e22fc1d37b35426f32fa",
          "message": "Merge pull request #50 from lpgauth/publish-from-release-script\n\nPublish to Hex from the release script",
          "timestamp": "2026-08-05T08:14:55-04:00",
          "tree_id": "e89b7231135acbe251886986788ed795050ef2f0",
          "url": "https://github.com/lpgauth/torque/commit/061c2e0d695a9503a3f3e22fc1d37b35426f32fa"
        },
        "date": 1785932504822,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 256373.36954132034,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 498.8966933632862,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 815937.7892083845,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 793997.4239388779,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 675724.6844346971,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 666881.0840511604,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 632.6789844561072,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 628.5120052999175,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 537.811949541911,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 535.5224557077886,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 339889.7088348948,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 334821.12775557156,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 282289.2653794999,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 281465.731309656,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 266090.45792694204,
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
          "id": "76c893c12c9bb39fc083e4642e4135b447f2639e",
          "message": "Bump version to 0.2.7",
          "timestamp": "2026-08-05T08:36:37-04:00",
          "tree_id": "20682a263d7a4239c3758aad15d9a9e49a81cf73",
          "url": "https://github.com/lpgauth/torque/commit/76c893c12c9bb39fc083e4642e4135b447f2639e"
        },
        "date": 1785933797144,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 240421.5589890426,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 521.9318245296943,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 836588.9723030187,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 830378.9364192367,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 694638.7985916338,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 693719.979181186,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 946.4732611155226,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 940.5592970839967,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 753.5282879537148,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 752.4491600962349,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 345673.13284684083,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 328082.33219039737,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 293561.25212887535,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 284961.75780867046,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 267929.34436117223,
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
          "id": "46d19a90705c9611f5ea70445d914fda03816028",
          "message": "Add checksums for v0.2.7",
          "timestamp": "2026-08-05T08:39:54-04:00",
          "tree_id": "50974cbd02674a73c2e54224bfa0f68d99c90ed7",
          "url": "https://github.com/lpgauth/torque/commit/46d19a90705c9611f5ea70445d914fda03816028"
        },
        "date": 1785933984837,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 257784.41789192762,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 490.59985703920165,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 781821.3073691895,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 716545.8472917897,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 640302.1144125575,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 635901.0384757417,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 633.6995075537945,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 627.3819548151258,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 539.2815151892704,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 537.9026348334195,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 314191.429333745,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 313200.4785470291,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 283106.63025878783,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 275100.7786723689,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 261523.2810454338,
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
          "id": "46d19a90705c9611f5ea70445d914fda03816028",
          "message": "Add checksums for v0.2.7",
          "timestamp": "2026-08-05T08:39:54-04:00",
          "tree_id": "50974cbd02674a73c2e54224bfa0f68d99c90ed7",
          "url": "https://github.com/lpgauth/torque/commit/46d19a90705c9611f5ea70445d914fda03816028"
        },
        "date": 1785935648437,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 259335.88282169338,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 505.78389240181554,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 780764.094515638,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 766231.2426859972,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 648732.6910219715,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 648346.1170330613,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 621.9888417024109,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 618.0020916895592,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 538.7186794219848,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 536.6331110509615,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 337479.22340799763,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 324432.0305675602,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 282980.76742069906,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 277817.45535806596,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 265984.32013814896,
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
          "id": "9564b9984ed38edd8c30fcff1a14bb8efb2547a8",
          "message": "Merge pull request #52 from lpgauth/upgrade-sonic-rs-0.5.8\n\nUpgrade vendored sonic-rs to 0.5.8",
          "timestamp": "2026-09-10T08:46:56-04:00",
          "tree_id": "d38e7e1dc8680f3e21951ebd02cc2a8e1e49d01b",
          "url": "https://github.com/lpgauth/torque/commit/9564b9984ed38edd8c30fcff1a14bb8efb2547a8"
        },
        "date": 1789044804006,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 341939.41498296725,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 679.6392243075742,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 953295.1070066656,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 902517.5716831891,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 787973.2152459862,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 776909.3612695934,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 831.0109406968614,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 830.200551471164,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 698.0845635032096,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 696.6438216398366,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 419145.16950520285,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 401405.0590010846,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 363497.25971193216,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 344926.8224863078,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 331447.63086813374,
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
          "id": "2d4980f5c4fa08ac5494b895874d2378470f43ec",
          "message": "Merge pull request #54 from lpgauth/bench-cache-cpu-key\n\nKey the benchmark Rust cache on the runner CPU model",
          "timestamp": "2026-09-10T13:34:25-04:00",
          "tree_id": "746fb87e8a8fa5ee3d7483c2d49288f984a3f498",
          "url": "https://github.com/lpgauth/torque/commit/2d4980f5c4fa08ac5494b895874d2378470f43ec"
        },
        "date": 1789062103831,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 244867.13658782563,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 492.55940177806775,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 960510.1910477054,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 941530.7466760814,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 786054.2901286767,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 760296.9305601,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1164.7564639292675,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1162.2026285760396,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 843.2466915229071,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 842.186914018414,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 298981.9614283378,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 282075.01790460595,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 266616.5973494441,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 260825.78896542796,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 247241.55661084582,
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
          "id": "36d9e6eedcdaa54bdcb86f644e25c39c3a6ad4b0",
          "message": "Bump version to 0.3.0",
          "timestamp": "2026-09-10T13:34:38-04:00",
          "tree_id": "ab41849fa90503f0018cf6814932cb0a9cf5b076",
          "url": "https://github.com/lpgauth/torque/commit/36d9e6eedcdaa54bdcb86f644e25c39c3a6ad4b0"
        },
        "date": 1789062127861,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 272316.4231220395,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 505.97154671827985,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 865151.5227674702,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 842594.5022628158,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 715416.9888618618,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 708256.7555505381,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 782.7922687323127,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 779.8616618658791,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 646.0349573959816,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 638.138079947711,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 307254.85316967755,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 304138.4265026179,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 262939.9487953058,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 255848.33683926062,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 253884.6697832337,
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
          "id": "fabe84bb7f7fafdd908b028e5a17dc32be42ab1d",
          "message": "Add checksums for v0.3.0",
          "timestamp": "2026-09-10T13:40:01-04:00",
          "tree_id": "bb6fa620f13340417f0ed7f2fb72c59f910b2d9f",
          "url": "https://github.com/lpgauth/torque/commit/fabe84bb7f7fafdd908b028e5a17dc32be42ab1d"
        },
        "date": 1789062429103,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 265003.5090956414,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 483.5992513061651,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 848353.5805244731,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 823991.8496593054,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 705059.0829887488,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 701236.8524997339,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 912.5453575684814,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 904.4839865704668,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 723.7528610592589,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 722.3672627311794,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 378544.7450902456,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 364412.3942739522,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 306094.3842474603,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 292817.5787786129,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 278886.6287671693,
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
          "id": "9a46a66221c5006b3c7f6ebfb509cfd427173b3f",
          "message": "Merge pull request #55 from lpgauth/readme-bench-refresh\n\nRefresh README benchmark numbers",
          "timestamp": "2026-09-10T15:25:41-04:00",
          "tree_id": "b8338bfc1a70cddfedd04b0c98f6cd016389389a",
          "url": "https://github.com/lpgauth/torque/commit/9a46a66221c5006b3c7f6ebfb509cfd427173b3f"
        },
        "date": 1789136777816,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 320868.9372113123,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 636.0917427144859,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1227640.9040899074,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1165979.2292156953,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1024103.6894990366,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1011668.7881125096,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1277.10164033135,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1262.3655216078423,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 960.036467044289,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 952.5569526236197,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 385934.0723566875,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 383433.90015299566,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 327108.57330684754,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 323359.9197240115,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 313405.34567681793,
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
          "id": "30c6729893aa34ecc46e07bc418b3cb9e201dc49",
          "message": "Merge pull request #56 from lpgauth/one-pass-extract\n\nExtract compiled paths in one pass without building a DOM",
          "timestamp": "2026-09-11T13:48:14-04:00",
          "tree_id": "afbf72aeeeb9fcee486a5350cb32ac7d82feeb84",
          "url": "https://github.com/lpgauth/torque/commit/30c6729893aa34ecc46e07bc418b3cb9e201dc49"
        },
        "date": 1789149287054,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 339776.82571948785,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 685.7309851784262,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1234411.5028211253,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1226603.434899794,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1028586.2965218512,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1028127.367671302,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1308.1149669749032,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1297.720556948233,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 999.0756181032832,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 994.4996681063168,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 392141.61166580574,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 383562.6342678981,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1614126.4264329807,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 830556.6688798565,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 824776.7324848892,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 329640.5105708646,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 323957.5408923562,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 314122.6491349539,
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
          "id": "b8cb51a1e1cb0eb3d2c1eb53edf204a9a409a913",
          "message": "Add checksums for v0.3.1",
          "timestamp": "2026-09-11T13:53:31-04:00",
          "tree_id": "20fbccd3841e9012bc5f09e03f4438e115832947",
          "url": "https://github.com/lpgauth/torque/commit/b8cb51a1e1cb0eb3d2c1eb53edf204a9a409a913"
        },
        "date": 1789149751167,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 336601.6105412939,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 639.8438302791864,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1232711.5715320606,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1210512.6608881028,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1039192.8216076512,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1025164.6342641104,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1269.6500244500223,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1269.0057919751123,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 986.9758878145526,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 975.9379980628436,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 378895.66326591227,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 372807.49109112937,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1586825.5975540492,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 810832.2860326221,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 809523.4960454729,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 330704.90376592794,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 325400.04445550323,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 315361.8254881743,
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
          "id": "afd44e97572128e4cdcc19b3576a2301751bb654",
          "message": "Merge pull request #51 from gilbertwong96/feat/encoder-protocol\n\nSupport optional Encoder protocol for structs",
          "timestamp": "2026-09-14T09:04:10-04:00",
          "tree_id": "e02313ff382bff9d503e16a53071a4114bf4c9be",
          "url": "https://github.com/lpgauth/torque/commit/afd44e97572128e4cdcc19b3576a2301751bb654"
        },
        "date": 1789391430754,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 344724.87745046115,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 685.9793803152514,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1124431.994583476,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1118635.9789588063,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 911026.5423392389,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 909696.9003731039,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1075.8720735996567,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1062.1833436235174,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 864.8059086178325,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 864.0878993397589,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 372183.28840135696,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 368916.26858855085,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1630751.695271163,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 830371.4992241332,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 827360.919599351,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 323894.4501744126,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 310261.5493101772,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 304389.81577534194,
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
          "id": "5f34bc61081a66ca36d9317c6ccf318e5c8aa425",
          "message": "Bump version to 0.4.0",
          "timestamp": "2026-09-14T09:04:50-04:00",
          "tree_id": "bbdf326a909f4431b16a4dc3c2a9a831a1aab8f4",
          "url": "https://github.com/lpgauth/torque/commit/5f34bc61081a66ca36d9317c6ccf318e5c8aa425"
        },
        "date": 1789391516405,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 441529.3261513384,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 916.2398026791083,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1662892.8864641725,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1541842.0223514147,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1343769.859910702,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1319033.3968149812,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1659.037485925368,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1575.9730095499026,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1474.1065861647792,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1393.9254092369472,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 471417.9826331473,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 454201.03493294,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 2007524.7568655652,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 1006520.34042382,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 991269.4174053986,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 430477.3535866419,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 428834.45645198977,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 389975.0889957763,
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
          "id": "7df0f8f0104a949a54f31033f65adf15c1a1da4b",
          "message": "Merge pull request #57 from lpgauth/fix/bench-pgo-cache-cpu-key\n\nPut the CPU model in the bench cache's shared-key",
          "timestamp": "2026-09-14T09:42:12-04:00",
          "tree_id": "e1c303eebf11559baa79a075548641c663868132",
          "url": "https://github.com/lpgauth/torque/commit/7df0f8f0104a949a54f31033f65adf15c1a1da4b"
        },
        "date": 1789393753202,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 268413.9051930951,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 493.06920295293133,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 838296.2975062995,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 826923.4479413647,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 752177.5021565399,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 741886.9924140512,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 893.7670278244711,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 888.0684071054133,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 736.8100474785662,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 732.5389782994621,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 348863.27202550316,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 348396.86717997317,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1235239.7893306445,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 677717.9737524857,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 677349.0376400646,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 291451.2156058602,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 284068.2853116181,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 281535.38631530915,
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
          "id": "6b955f3a7300db86357ced57400454116fbca692",
          "message": "Merge pull request #58 from lpgauth/chore/update-deps\n\nUpdate Elixir and Rust deps",
          "timestamp": "2026-09-14T15:11:54-04:00",
          "tree_id": "9735aeebc73632375a1e4144e7cedcbe7a485b9d",
          "url": "https://github.com/lpgauth/torque/commit/6b955f3a7300db86357ced57400454116fbca692"
        },
        "date": 1789413548154,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 270796.5380921048,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 484.588445957683,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 896846.9716039165,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 880794.9214330182,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 734375.9085492197,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 725409.9531211725,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 922.8654469737402,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 920.2028025986872,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 729.8290844994359,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 723.1759167619131,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 365733.1649354962,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 361088.6226320565,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1271657.4227133351,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 696790.476525858,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 696498.2552830145,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 298871.7527375602,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 295406.9347255895,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 279432.56735101,
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
          "id": "c1b6458555bf37172d60ac0c5f7b6de3b2d71e93",
          "message": "Bump version to 0.5.0",
          "timestamp": "2026-09-14T15:13:14-04:00",
          "tree_id": "4d44d666e4b2f0042eeac7681b02c1502ab940a6",
          "url": "https://github.com/lpgauth/torque/commit/c1b6458555bf37172d60ac0c5f7b6de3b2d71e93"
        },
        "date": 1789413738516,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 266959.6604467679,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 484.74064507446514,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 861368.80930619,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 849004.0873442466,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 727361.6071581902,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 717841.6062625926,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 910.4721461418877,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 896.7833407720557,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 721.7926837497465,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 714.534290162938,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 307717.98699502856,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 302518.226394908,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1246055.1591411745,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 686131.1531259788,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 682463.545249163,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 269592.21379296633,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 268850.1081575516,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 262903.1102821606,
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
          "id": "aec4d0b7f48e7dc1d038fef53180476c1a421243",
          "message": "Bump version to 0.4.1",
          "timestamp": "2026-09-14T15:17:59-04:00",
          "tree_id": "09e75c918753369e459d4151b3b78f1dd0232e14",
          "url": "https://github.com/lpgauth/torque/commit/aec4d0b7f48e7dc1d038fef53180476c1a421243"
        },
        "date": 1789413983872,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 381913.8050911695,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 730.0696777699949,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1468100.023809793,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1428498.781245552,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1234115.5582688765,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1206658.5139910383,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1352.1264179014377,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1338.654054359568,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1218.687457642291,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1199.1943225573327,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 465732.7109719172,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 462053.72209727694,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1608905.836974263,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 934660.971388549,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 934424.303858846,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 403017.86402193306,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 397069.6586377929,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 378883.595978511,
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
          "id": "8bfa2afdf3cbe3d6c2e2684b94ded2c102021af4",
          "message": "Add checksums for v0.4.1",
          "timestamp": "2026-09-14T15:41:11-04:00",
          "tree_id": "1a5cda0b42c9ef822ab664007f178d1d0253b902",
          "url": "https://github.com/lpgauth/torque/commit/8bfa2afdf3cbe3d6c2e2684b94ded2c102021af4"
        },
        "date": 1789415307772,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 269999.3147201393,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 508.35854391419645,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 888477.940594707,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 872786.3088818606,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 737513.9663572945,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 719011.6510136285,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 930.5675224059693,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 926.2911446945332,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 696.5423996562395,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 691.8865611102494,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 358784.0315340968,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 357274.79310963437,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1270996.6081790505,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 692693.835392062,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 692666.5656260095,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 298828.07318542997,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 297557.80296137085,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 280003.3306620185,
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
          "id": "bfe261ab69976e34f3ff7e0f6b592901811bbc6e",
          "message": "Merge pull request #59 from lpgauth/fix/pgo-workload-strings\n\nAdd multi-byte UTF-8 and escape-heavy strings to the PGO workload",
          "timestamp": "2026-10-01T10:14:11-04:00",
          "tree_id": "b5be8e3f3c54470b7d29e68a097cffbf6224dedc",
          "url": "https://github.com/lpgauth/torque/commit/bfe261ab69976e34f3ff7e0f6b592901811bbc6e"
        },
        "date": 1790864495649,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 262332.0805957762,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 517.472561865526,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 855986.3787024514,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 844501.3171416803,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 717560.9294026826,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 714788.4280505412,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 786.8546176244708,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 779.5005376782209,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 649.6785293235181,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 643.1174771464467,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 302833.1535083822,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 302799.52987405553,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1220295.9063571573,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 679728.0235526848,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 666102.4051023488,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 261797.8598840193,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 261488.52953135065,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 247406.19701785466,
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
          "id": "357a6dfe963a07f513005cbf4319d72555810ee8",
          "message": "Bump version to 0.4.2",
          "timestamp": "2026-10-01T10:19:12-04:00",
          "tree_id": "3a9c69758669b73fa1bafed1eaf8dac522731c84",
          "url": "https://github.com/lpgauth/torque/commit/357a6dfe963a07f513005cbf4319d72555810ee8"
        },
        "date": 1790864801127,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 271213.1128971155,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 461.76804219294166,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 888571.0245229511,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 888185.0815562895,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 741980.9354928726,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 722243.2193172188,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 924.5186999641704,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 923.792144633966,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 724.8204193156146,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 719.5264275519056,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 336390.1242969448,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 333534.8958086382,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1240000.1874384282,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 707045.178740307,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 696419.3664434152,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 289779.05980464234,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 277702.4236108288,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 264277.20425393083,
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
          "id": "77de20a3eb2978c96aef928c1e06b9cff76a8490",
          "message": "Add checksums for v0.4.2",
          "timestamp": "2026-10-01T10:23:48-04:00",
          "tree_id": "f7a64220f0dee0df72df40bfa3ef8c5a250e3246",
          "url": "https://github.com/lpgauth/torque/commit/77de20a3eb2978c96aef928c1e06b9cff76a8490"
        },
        "date": 1790865032025,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 356471.14163828886,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 671.0491648496234,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1119619.2834048974,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1102673.4356039788,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 922314.3376903352,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 908234.4200884037,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1106.8969538173405,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1098.0407104576163,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 893.3467807345002,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 881.5470815316162,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 394503.8008200427,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 377342.78755272884,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1636967.9483803767,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 868962.8417707108,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 865949.4919735414,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 342811.09192657965,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 333825.9501619335,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 319100.01104363654,
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
          "id": "7e906d6c578c335175a930494978a3b3500f9945",
          "message": "Merge pull request #60 from lpgauth/fix/release-pgo-target\n\nProfile the --target build in the release workflow",
          "timestamp": "2026-10-01T10:56:17-04:00",
          "tree_id": "06fcd78d11716bb11cd54872e6f362baa2f9c0ca",
          "url": "https://github.com/lpgauth/torque/commit/7e906d6c578c335175a930494978a3b3500f9945"
        },
        "date": 1790866974142,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 335289.04898586316,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 667.8082733730665,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1244646.3962326525,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1238408.1421986693,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1046783.859751463,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1027389.8655298618,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1304.6969020543957,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1290.9631505330046,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 980.6412107307887,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 974.5861876553844,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 381798.8129214395,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 375518.8858943469,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1578072.1621248596,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 827697.3619714932,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 827491.9586441562,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 331497.14819815673,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 321558.10573685344,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 307334.427531793,
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
          "id": "57f874cc36776c79338b6c8e8992b243feced895",
          "message": "Bump version to 0.4.3",
          "timestamp": "2026-10-01T10:56:44-04:00",
          "tree_id": "e5193e552d840db0bd8570e80c3200e9561ed437",
          "url": "https://github.com/lpgauth/torque/commit/57f874cc36776c79338b6c8e8992b243feced895"
        },
        "date": 1790867043351,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 264801.7398272949,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 455.5734620557744,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 862856.9510317161,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 853878.3698625802,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 744441.921795462,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 729696.5968105104,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 913.8933805782943,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 907.004895212538,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 705.5359533015346,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 700.7559845257831,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 313263.4473971188,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 303436.5957127655,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1236927.4043954287,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 697400.4133881399,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 690680.9651145374,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 259974.24533941635,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 255407.21158204423,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 249084.1880558858,
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
          "id": "5dde2fb7f36aef8ae7570c3f9c5ae90501649357",
          "message": "Add checksums for v0.4.3",
          "timestamp": "2026-10-01T11:01:19-04:00",
          "tree_id": "9a9e6c5a0967e44396fbcb4e1ddc797a82fb13aa",
          "url": "https://github.com/lpgauth/torque/commit/5dde2fb7f36aef8ae7570c3f9c5ae90501649357"
        },
        "date": 1790867320416,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 256374.12225262268,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 450.3930682850881,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 883030.5970366782,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 874568.7552848604,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 720904.727820661,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 712651.5493071763,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 924.7011659581432,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 918.736462196003,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 718.9697421079634,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 706.3923160407438,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 336169.44964271015,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 331746.4310260311,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1236601.013754629,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 701254.1024302919,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 687235.349919015,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 288442.3834188783,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 287330.79604820337,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 280972.9652659605,
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
          "id": "856dcb5c4888019d0f239a79827e7ece88872936",
          "message": "Merge pull request #61 from lpgauth/fix/v3-pclmulqdq\n\nEnable pclmulqdq in the v3 build",
          "timestamp": "2026-10-01T15:31:13-04:00",
          "tree_id": "8430141c463cc8fe23c53c3e324770548f542580",
          "url": "https://github.com/lpgauth/torque/commit/856dcb5c4888019d0f239a79827e7ece88872936"
        },
        "date": 1790883456574,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 358712.4600088382,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 639.9699074026321,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1124723.5439370333,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1079125.962660349,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 912019.3268715134,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 890970.4865999585,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1083.7424242588022,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1045.4015722750362,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 857.0521738516924,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 853.9529574783127,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 432722.9050504322,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 429779.0904402109,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1657506.4874513857,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 863761.21745423,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 860571.214022665,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 364311.1360859348,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 357765.7750166733,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 357185.4872307581,
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
          "id": "750bc9447a1688e33258905375b91032a058df68",
          "message": "Bump version to 0.4.4",
          "timestamp": "2026-10-01T15:32:04-04:00",
          "tree_id": "f562f60572c52a8f49fbc16f0cdfe41030255118",
          "url": "https://github.com/lpgauth/torque/commit/750bc9447a1688e33258905375b91032a058df68"
        },
        "date": 1790883549659,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 270339.12169907714,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 505.7910531626186,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 871960.8851879739,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 854646.5262090712,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 700009.2746328824,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 697837.7424973594,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 790.1307953717438,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 788.0330861191813,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 649.581999289845,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 636.9223897317654,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 295656.0744856377,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 291095.1448684416,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1223247.6667997246,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 663664.5794988605,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 662505.2652771584,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 263642.9968797846,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 258929.73508423148,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 250177.81062659132,
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
          "id": "57d9bd8ac3a60b53bf8f4c58e253988c93a12b79",
          "message": "Add checksums for v0.4.4",
          "timestamp": "2026-10-01T15:37:58-04:00",
          "tree_id": "1405ce2509f3890a9087becbf0b12cc48e5d6b3c",
          "url": "https://github.com/lpgauth/torque/commit/57d9bd8ac3a60b53bf8f4c58e253988c93a12b79"
        },
        "date": 1790883895189,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 474052.79807884,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 823.8831630960362,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1646391.9371734993,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1555419.231009878,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1313430.4747825912,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1267271.844394387,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1764.7405643244895,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1704.7111747576478,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1482.5405350380588,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1389.7994982136918,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 426401.7936045654,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 418153.160032187,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 2072291.7613224785,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 1054355.0176706263,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1008713.5185428391,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 431645.0232478074,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 423883.9947956388,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 375235.31090774975,
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
          "id": "068319b99cd9ae33bd02df8a54407c79de44b1f1",
          "message": "Merge pull request #62 from lpgauth/perf/map-order\n\nOrder object members before handing them to ERTS",
          "timestamp": "2026-10-01T20:33:13-04:00",
          "tree_id": "b31b3e34164899d411570fa13f5f8aea9a6060fa",
          "url": "https://github.com/lpgauth/torque/commit/068319b99cd9ae33bd02df8a54407c79de44b1f1"
        },
        "date": 1790901620878,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 198859.06944557544,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 456.8750534235262,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 915909.3101881878,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 912602.484814151,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 773538.4028814014,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 767915.7849243248,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1140.948455359814,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1130.2444770058337,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 840.7337173531716,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 838.2315872607611,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 291966.51616928505,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 290650.5916419936,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1198041.3093245393,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 667313.5911583608,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 665512.9879228686,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 258009.43034994716,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 247572.99856974604,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 230979.2171737372,
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
          "id": "51ed83d97a35b8e736f7b090a85c805a822fca2b",
          "message": "Merge pull request #66 from lpgauth/perf/split-key-stack\n\nKeep object keys on their own stack",
          "timestamp": "2026-10-01T20:36:02-04:00",
          "tree_id": "64a7e4a4e43f1ce803bc79531b6e949f21701582",
          "url": "https://github.com/lpgauth/torque/commit/51ed83d97a35b8e736f7b090a85c805a822fca2b"
        },
        "date": 1790901783715,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 262479.9940799842,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 493.9380967937035,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 904950.3425286367,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 896928.9102092559,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 745780.8776203046,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 740693.1948215727,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 925.4317458481436,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 922.7094491916974,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 722.9312493540716,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 722.0606192208073,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 347242.3485334275,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 328040.2373499053,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1241887.7624908928,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 698306.7826538498,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 697743.0323827342,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 287727.4489908082,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 284021.69453702203,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 266830.14965700737,
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
          "id": "b9d592e977f02744098c0d8a9456d74345266295",
          "message": "Merge pull request #65 from lpgauth/perf/key-cache-tail\n\nUse the key's last 8 bytes in the key cache",
          "timestamp": "2026-10-01T20:38:22-04:00",
          "tree_id": "309d1b893cf365e8ab9a3179be57fd8ed8adb8f5",
          "url": "https://github.com/lpgauth/torque/commit/b9d592e977f02744098c0d8a9456d74345266295"
        },
        "date": 1790901962294,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 265562.945566257,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 465.4569138774579,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 906666.4804494604,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 898658.6689903367,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 766788.4007151836,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 755758.9948260868,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 937.5501705333788,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 931.9525074655797,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 713.0547489752063,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 705.1711067207124,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 352516.5321528796,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 349893.09679474856,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1271177.746576268,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 695513.3862126457,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 695229.0558169417,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 305666.9743092685,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 294528.2305002625,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 281361.53078758664,
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
          "id": "b44a95404c56c24b94cedef98709f30672ae9a44",
          "message": "Merge pull request #63 from lpgauth/perf/encode-map-iter\n\nWalk maps with a forward-only iterator when encoding",
          "timestamp": "2026-10-01T20:40:22-04:00",
          "tree_id": "ffce1841ac7e9c57c6e645adb8f572d05a310fb4",
          "url": "https://github.com/lpgauth/torque/commit/b44a95404c56c24b94cedef98709f30672ae9a44"
        },
        "date": 1790902041301,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 265125.0349350287,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 459.3710627094386,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 892251.1696786027,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 868187.2683063211,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 773380.6566607022,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 769305.3746906866,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 936.7915640806076,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 932.0112277084097,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 738.9022099429712,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 736.2138381638612,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 333726.8278550003,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 323015.828653238,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1245789.9525186594,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 703573.6080967262,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 699510.0885961145,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 273387.36644900363,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 267426.2105899843,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 246337.69733061688,
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
          "id": "4e83fb8b62456d8f6ba5bf0e7ff8b4238871a52e",
          "message": "Merge pull request #64 from lpgauth/perf/utf8-encode\n\nValidate non-ASCII string tails with simdutf8 when encoding",
          "timestamp": "2026-10-01T20:40:26-04:00",
          "tree_id": "747e4c119d653bb6335da6d9b4ab640da23b947e",
          "url": "https://github.com/lpgauth/torque/commit/4e83fb8b62456d8f6ba5bf0e7ff8b4238871a52e"
        },
        "date": 1790902046289,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 271551.11198681395,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 487.8010688689018,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 927201.5002098022,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 907020.0832931055,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 821336.5204607086,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 812341.1530847008,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 758.4658779953189,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 754.5016874747536,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 689.2438691144091,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 686.5846021064878,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 309723.9509064482,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 309379.0720937538,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1225607.3437137012,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 661727.2906535853,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 658743.8585425349,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 276205.31666531326,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 272450.9373825711,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 261710.0196594133,
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
          "id": "8dccd2a12c6ba080eea1465c91f193939199aaae",
          "message": "Merge pull request #68 from lpgauth/perf/extract-request-shape\n\nSpeed up compiled extraction of request-shaped documents",
          "timestamp": "2026-10-05T10:57:20-04:00",
          "tree_id": "910342e5b0543c49c569c25553268f432f74b0a5",
          "url": "https://github.com/lpgauth/torque/commit/8dccd2a12c6ba080eea1465c91f193939199aaae"
        },
        "date": 1791212658171,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 284789.3823974921,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 555.3249757747332,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1070377.4317375035,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1063321.0638948744,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 947149.0687061121,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 935182.3303246445,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1173.2248620963194,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1149.4987213330733,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 912.7067064931309,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 898.9873040824453,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 344312.5743811568,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 341618.7004973579,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1436809.470087081,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 729928.5609282362,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 726739.8694440749,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 288091.418717767,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 279123.59296043735,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 277764.0209745423,
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
          "id": "7c8728f95cfe2e3e8227b810ee35bebdd7b9b2cd",
          "message": "Merge pull request #69 from lpgauth/fix/bench-glazer-pgo\n\nFix the Benchmark workflow's glazer PGO build",
          "timestamp": "2026-10-05T10:57:08-04:00",
          "tree_id": "95648a9bdc075886798607e099421cadfec6bd27",
          "url": "https://github.com/lpgauth/torque/commit/7c8728f95cfe2e3e8227b810ee35bebdd7b9b2cd"
        },
        "date": 1791212685773,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 263114.3189204329,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 456.05966276807715,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 870578.3518126893,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 862075.3314976634,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 782571.5395637737,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 769560.9807439666,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 897.7079899782123,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 895.2022639762944,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 751.1617301249709,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 749.6966569679414,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 363080.1776159183,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 362801.77074895106,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1246212.8805617287,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 689296.4430543764,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 684098.1506647451,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 297064.0407498287,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 295379.73525332316,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 288455.7543689408,
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
          "id": "bc0b6792c06c2a09fc31b2e2a514352bfc4cda71",
          "message": "Bump version to 0.4.6",
          "timestamp": "2026-10-05T10:58:30-04:00",
          "tree_id": "b6cefee48140ffc5f3311033e7fda441ee4c0795",
          "url": "https://github.com/lpgauth/torque/commit/bc0b6792c06c2a09fc31b2e2a514352bfc4cda71"
        },
        "date": 1791212750591,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 257622.3479567499,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 468.65860037924955,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 862185.6734971019,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 824427.4951641514,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 787713.211516531,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 763272.3662890291,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 937.95154001916,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 927.2879915665175,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 747.7214204690484,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 746.4442578655496,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 369140.70089878875,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 365056.03549545555,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1307013.6543245942,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 726893.7444344291,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 721544.4030492256,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 309705.00495146605,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 290816.42279529944,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 287324.12783107226,
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
          "id": "89a0694ecf226d3245c1b0bb791f1e4dc18554f8",
          "message": "Add checksums for v0.4.6",
          "timestamp": "2026-10-05T11:02:38-04:00",
          "tree_id": "b0e75ffda988211818ac9b9e79e314604dea3ff1",
          "url": "https://github.com/lpgauth/torque/commit/89a0694ecf226d3245c1b0bb791f1e4dc18554f8"
        },
        "date": 1791212999351,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 267116.6253343534,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 465.7670516381269,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 866578.6550319886,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 860829.2845225063,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 756354.0709874828,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 754953.231353199,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 773.6837303674218,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 764.0401705533208,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 696.7240765690283,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 689.9067310324053,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 294589.06259974185,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 289879.04554485757,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1276012.3816840646,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 686742.5193099601,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 681901.7324478606,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 258058.23955328524,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 256571.482443083,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 236891.43501193,
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
          "id": "90137b58a21bc310eb83a6126db5f63d7a5332cb",
          "message": "Merge pull request #70 from lpgauth/fix/review-findings\n\nFixes from a full repo review",
          "timestamp": "2026-10-06T21:23:10-04:00",
          "tree_id": "aac6e8c4bd5097540d7b983cfed4f61699f40908",
          "url": "https://github.com/lpgauth/torque/commit/90137b58a21bc310eb83a6126db5f63d7a5332cb"
        },
        "date": 1791336553621,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 447991.1300910099,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 765.9509706214017,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1721589.3524904635,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1672488.6414397345,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1643072.1370858462,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1566102.8023675971,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1779.0683801034804,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1769.0367554824822,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1688.2863254113913,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1645.555562267529,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 415159.462068519,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 405433.38239074557,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1993863.49429905,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 1019362.160386907,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1013311.8329639265,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 414402.3068483487,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 388269.7270190089,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 350323.36689465283,
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
          "id": "759c14f9e91247ac895690c655ad4b7b24259bf7",
          "message": "Bump version to 0.4.7",
          "timestamp": "2026-10-06T21:23:46-04:00",
          "tree_id": "64a71ab8fd7f26da215a73255651c7ee7f4b26f7",
          "url": "https://github.com/lpgauth/torque/commit/759c14f9e91247ac895690c655ad4b7b24259bf7"
        },
        "date": 1791336674342,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 258308.8581772526,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 471.97088272174,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 918818.8831338412,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 911794.0327451698,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 789262.121668011,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 778841.3000247946,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 915.7948936665534,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 901.1727826755052,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 643.6035528145686,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 613.3438623068844,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 339804.65958077315,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 333896.07944836305,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1261947.8397862671,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 709347.602603756,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 709268.221194226,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 292313.8587944634,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 283836.89111981745,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 266765.4384553972,
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
          "id": "092d2d62ebcec11232ed83f490a774d93c723df8",
          "message": "Add checksums for v0.4.7",
          "timestamp": "2026-10-06T21:30:42-04:00",
          "tree_id": "f72d55283bb4ad4b669c43ec9adf3eb2ec2c3646",
          "url": "https://github.com/lpgauth/torque/commit/092d2d62ebcec11232ed83f490a774d93c723df8"
        },
        "date": 1791337070793,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 261569.23341631945,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 464.38764413083015,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 918388.6305015743,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 917557.4325691516,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 820846.2986245614,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 797792.5921444341,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 867.9872087237909,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 863.5244895346973,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 756.801308457541,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 741.4283865075587,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 297835.87089207425,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 297652.0639655476,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1246414.9211820175,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 705594.6180968072,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 700117.3146677501,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 259006.15214490023,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 254917.19911967678,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 235523.27225920168,
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
          "id": "47e123e00d94d6f623cb8ed93c3669a3071d7fbe",
          "message": "Merge pull request #71 from lpgauth/feat/erlang-support\n\nErlang support",
          "timestamp": "2026-10-07T08:44:02-04:00",
          "tree_id": "0f2b0bce84b4b25ccedab2359cc2190e402eb18b",
          "url": "https://github.com/lpgauth/torque/commit/47e123e00d94d6f623cb8ed93c3669a3071d7fbe"
        },
        "date": 1791377405467,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 456244.75160275755,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 849.5947090959169,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1737370.4060449551,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1736744.3534298935,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1538565.625976672,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1523796.9363760883,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1702.9453197080986,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1668.4056413484209,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1654.3371693015404,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1610.587003705264,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 538890.9510628913,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 489337.24239736976,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1989351.8470267525,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 1077929.6529397226,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 1052660.3032768862,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 490932.8928977978,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 452891.2802607246,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 452304.4336922293,
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
          "id": "b0d3fc2e9321840508ec429f91ab92ad252f5bc7",
          "message": "Bump version to 0.5.0",
          "timestamp": "2026-10-07T08:45:21-04:00",
          "tree_id": "0dad647c99c1ffb1e470b2335afb627f29a14557",
          "url": "https://github.com/lpgauth/torque/commit/b0d3fc2e9321840508ec429f91ab92ad252f5bc7"
        },
        "date": 1791377553559,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 259352.40159189206,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 455.3949789996806,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 886554.681039302,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 883484.3122177689,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 782816.0369365423,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 780202.9724871907,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 917.5357155847463,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 909.6839644697423,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 729.215469231793,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 724.7136793750248,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 383015.7834247119,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 368657.10094047233,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1272184.6679245112,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 704823.4151309499,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 702572.4588708549,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 293760.6761699581,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 290317.08736824983,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 281164.86096927477,
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
          "id": "2bfe0516ad78c47fade5d95050a8a1e7179d0e4e",
          "message": "Add checksums for v0.5.0",
          "timestamp": "2026-10-07T08:51:01-04:00",
          "tree_id": "b4d7ef1f4288faa5a09e3a58b9bd575d8899a9c9",
          "url": "https://github.com/lpgauth/torque/commit/2bfe0516ad78c47fade5d95050a8a1e7179d0e4e"
        },
        "date": 1791377846420,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 378277.982420366,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 735.8088710358982,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1517949.1990218486,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1374391.636022051,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1320120.744685498,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1173371.5139036984,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1337.6287754080427,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 1308.2428750708477,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 1275.216952132819,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1272.5602628196693,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 504655.39199300855,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 472287.2177725349,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1872427.240501404,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 977876.7013494889,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 972408.256076713,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 413135.4099965352,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 412055.7766050287,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 375468.9569255769,
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
          "id": "d91d9249f3b57cd5de559cbd2e7ab7d1d294c0a3",
          "message": "Merge pull request #72 from lpgauth/feat/fetch-nif-without-rustler\n\nFetch the NIF without RustlerPrecompiled",
          "timestamp": "2026-10-07T09:18:06-04:00",
          "tree_id": "10f1a3e1546d00f7e5721d8c4bb2dac6f94702b6",
          "url": "https://github.com/lpgauth/torque/commit/d91d9249f3b57cd5de559cbd2e7ab7d1d294c0a3"
        },
        "date": 1791379513281,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 261077.55676211958,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 448.3172160330061,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 887738.0418625284,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 884995.165824531,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 790090.8418401722,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 781767.2966416993,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 912.6294997213249,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 902.8016575377577,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 736.1944273806054,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 731.7531059760462,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 353476.63747754507,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 345921.6972912085,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1267592.5140417623,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 709693.2346167455,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 708953.9606992322,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 290872.01786365133,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 284221.68861400255,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 269240.59795199614,
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
          "id": "5b93b37afef58ec99312f439bfd59d72f0731135",
          "message": "Add checksums for v0.5.0",
          "timestamp": "2026-10-07T09:23:17-04:00",
          "tree_id": "b8c4bb0e4fee3478bd0fb26983c8cd76fbc958b4",
          "url": "https://github.com/lpgauth/torque/commit/5b93b37afef58ec99312f439bfd59d72f0731135"
        },
        "date": 1791379855797,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 256592.51973521835,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 447.8729821564867,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 891627.5780777249,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 871771.1098626709,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 786000.6962834328,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 771640.8880441198,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 909.9644400071869,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 903.621772126075,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 734.7180856846045,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 734.086435945333,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 321788.40698202804,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 305845.8671628007,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1270521.3173847503,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 706673.3821743951,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 706336.8536163828,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 287119.6644457289,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 274755.9773470599,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 257820.05394831518,
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
          "id": "2133e1582f18a57e1db44bf13babdf8cdca921a5",
          "message": "Merge pull request #73 from fbernier/perf/encoder\n\nCache atom names and write escapes with fixed-width stores when encoding",
          "timestamp": "2026-10-09T11:09:34-04:00",
          "tree_id": "e2004891d6b2125848831c47a47d5d1d8d13d447",
          "url": "https://github.com/lpgauth/torque/commit/2133e1582f18a57e1db44bf13babdf8cdca921a5"
        },
        "date": 1791559025603,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 260477.37621013913,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 455.613354804033,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1313897.5873617304,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1217264.5887977178,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1175660.0508517413,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1134275.0210084182,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 702.502221630224,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 692.5847879722212,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 623.7700476168953,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 622.3674618553401,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 316781.47948889784,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 276556.3902181362,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1197814.872802763,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 617035.0771366379,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 615268.0601391821,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 249694.14838916736,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 246820.12336125545,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 239461.33553793188,
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
          "id": "e3c7e32329847ffdc667105893ccbe638675c1e1",
          "message": "Merge pull request #74 from fbernier/fix/repeated-pointer-budget\n\nCount a repeated pointer once toward the extraction borrow budget",
          "timestamp": "2026-10-09T11:13:03-04:00",
          "tree_id": "17c598668b27aefb111bfa941b343bfb0037c10e",
          "url": "https://github.com/lpgauth/torque/commit/e3c7e32329847ffdc667105893ccbe638675c1e1"
        },
        "date": 1791559218167,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 258692.29751181064,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 449.3260170760971,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1255983.8808636388,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1240135.989344156,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1160938.9959261292,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1143980.5369740766,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 932.2023026106838,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 923.0754147966474,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 753.0813714942212,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 741.6538418902529,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 333324.0894785759,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 325561.28739662486,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1261144.863271214,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 708906.733549049,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 708631.0982902045,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 274599.3556819391,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 269127.82077989116,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 262916.2811090329,
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
          "id": "91efe4e0121c11d9bee781e6a421fe6eaa639f9d",
          "message": "Merge pull request #75 from fbernier/perf/extract-containers\n\nBuild selected containers during the extraction walk",
          "timestamp": "2026-10-09T12:34:02-04:00",
          "tree_id": "b4a0e195e023b6cbcea231ae695fa25994035f7a",
          "url": "https://github.com/lpgauth/torque/commit/91efe4e0121c11d9bee781e6a421fe6eaa639f9d"
        },
        "date": 1791564031427,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 343808.8135902327,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 629.0615935022854,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (1.2 KB OpenRTB)",
            "value": 1712899.2652352452,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (1.2 KB OpenRTB)",
            "value": 1636895.4720357868,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (1.2 KB OpenRTB)",
            "value": 1516857.8400271088,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (1.2 KB OpenRTB)",
            "value": 1501319.3955164454,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: binary (750 KB Twitter)",
            "value": 1056.3446267274858,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist :: iodata (750 KB Twitter)",
            "value": 1054.0238715971188,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: binary (750 KB Twitter)",
            "value": 943.0133278717908,
            "unit": "iterations/s"
          },
          {
            "name": "encode map :: iodata (750 KB Twitter)",
            "value": 924.7765433714131,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 407824.70704545313,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 370776.18119292427,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1614176.066118821,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 867742.4195553793,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 864724.571202563,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 347890.4391854381,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 341617.5045257521,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 329016.0313610737,
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
          "id": "17b7423ac219f7ae4e74852201dfc0c00aa0847b",
          "message": "Merge pull request #76 from lpgauth/bench-labels\n\nName encode benchmarks by function and input; update x86 numbers",
          "timestamp": "2026-10-09T20:50:28-04:00",
          "tree_id": "7b51ec01611e47b735b148129bdb825f92056f57",
          "url": "https://github.com/lpgauth/torque/commit/17b7423ac219f7ae4e74852201dfc0c00aa0847b"
        },
        "date": 1791593848402,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 256686.16158619808,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 449.38249935594894,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 proplist, atom keys (1.2 KB OpenRTB)",
            "value": 1348954.9474704668,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 proplist, atom keys (1.2 KB OpenRTB)",
            "value": 1323866.2352634955,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 map, atom keys (1.2 KB OpenRTB)",
            "value": 1183349.9080027097,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 map, atom keys (1.2 KB OpenRTB)",
            "value": 1167228.8233272566,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 proplist, binary keys (750 KB Twitter)",
            "value": 905.1428507398444,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 proplist, binary keys (750 KB Twitter)",
            "value": 902.2620578018635,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 map, binary keys (750 KB Twitter)",
            "value": 755.7720763828135,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 map, binary keys (750 KB Twitter)",
            "value": 749.8492899061813,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 335305.83248333866,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 316285.2095665425,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1258469.1544767842,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 714375.586816682,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 714093.3140838342,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 266090.0100207582,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 263876.6607344819,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 251843.2005939212,
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
          "id": "8127a0c981768f89b1c2bfe4216a91c686f3dce9",
          "message": "Bump version to 0.5.1",
          "timestamp": "2026-10-09T20:53:06-04:00",
          "tree_id": "c5eaa44b86a9dcfddd58c8c737555fa6d7eae512",
          "url": "https://github.com/lpgauth/torque/commit/8127a0c981768f89b1c2bfe4216a91c686f3dce9"
        },
        "date": 1791594017181,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "decode (1.2 KB OpenRTB)",
            "value": 263448.2901820279,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 456.175694152665,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 proplist, atom keys (1.2 KB OpenRTB)",
            "value": 1387976.8820513694,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 proplist, atom keys (1.2 KB OpenRTB)",
            "value": 1338742.6425750004,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 map, atom keys (1.2 KB OpenRTB)",
            "value": 1251753.496980559,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 map, atom keys (1.2 KB OpenRTB)",
            "value": 1225789.7800019798,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 proplist, binary keys (750 KB Twitter)",
            "value": 775.3422169513475,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 proplist, binary keys (750 KB Twitter)",
            "value": 775.1089724623117,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode!/1 map, binary keys (750 KB Twitter)",
            "value": 697.3457063559586,
            "unit": "iterations/s"
          },
          {
            "name": "encode encode_to_iodata/1 map, binary keys (750 KB Twitter)",
            "value": 684.1040262312431,
            "unit": "iterations/s"
          },
          {
            "name": "parse (1.2 KB OpenRTB)",
            "value": 321297.64015015354,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys (1.2 KB OpenRTB)",
            "value": 307904.6902104451,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys validate: false (1.2 KB OpenRTB)",
            "value": 1273151.2415814833,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil (1.2 KB OpenRTB)",
            "value": 694226.0269554235,
            "unit": "iterations/s"
          },
          {
            "name": "parse_get_many_nil unique_keys (1.2 KB OpenRTB)",
            "value": 692352.3839203637,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get_many (1.2 KB OpenRTB)",
            "value": 269174.41705926764,
            "unit": "iterations/s"
          },
          {
            "name": "parseunique_keys + get_many (1.2 KB OpenRTB)",
            "value": 265742.8667232899,
            "unit": "iterations/s"
          },
          {
            "name": "parse + get x5 (1.2 KB OpenRTB)",
            "value": 246917.03580510427,
            "unit": "iterations/s"
          }
        ]
      }
    ]
  }
}