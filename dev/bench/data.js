window.BENCHMARK_DATA = {
  "lastUpdate": 1774194749138,
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
            "name": "torque: proplist => binary",
            "value": 791694.3679536396,
            "unit": "iterations/s"
          },
          {
            "name": "torque: proplist => iodata",
            "value": 772076.907813022,
            "unit": "iterations/s"
          },
          {
            "name": "torque: map => iodata",
            "value": 662285.6186005804,
            "unit": "iterations/s"
          },
          {
            "name": "torque: map => binary",
            "value": 643232.7275494437,
            "unit": "iterations/s"
          },
          {
            "name": "otp json: map => iodata",
            "value": 491590.495837705,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy: proplist => iodata",
            "value": 406318.4399478911,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone: proplist => iodata",
            "value": 392677.64369348926,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy: map => iodata",
            "value": 339154.9450356695,
            "unit": "iterations/s"
          },
          {
            "name": "otp json: map => binary",
            "value": 317630.77689053805,
            "unit": "iterations/s"
          },
          {
            "name": "jason: map => iodata",
            "value": 312063.4983536024,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone: map => iodata",
            "value": 309128.3474508329,
            "unit": "iterations/s"
          },
          {
            "name": "jason: map => binary",
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
            "name": "torque: proplist => binary",
            "value": 572.0804259334856,
            "unit": "iterations/s"
          },
          {
            "name": "torque: proplist => iodata",
            "value": 564.7258193728827,
            "unit": "iterations/s"
          },
          {
            "name": "torque: map => iodata",
            "value": 477.8708138822127,
            "unit": "iterations/s"
          },
          {
            "name": "torque: map => binary",
            "value": 475.3511455989929,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy: proplist => iodata",
            "value": 294.5378285645238,
            "unit": "iterations/s"
          },
          {
            "name": "otp json: map => iodata",
            "value": 259.82768671864136,
            "unit": "iterations/s"
          },
          {
            "name": "jiffy: map => iodata",
            "value": 247.94241862114083,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone: proplist => iodata",
            "value": 242.2895990329278,
            "unit": "iterations/s"
          },
          {
            "name": "simdjsone: map => iodata",
            "value": 205.1336155209063,
            "unit": "iterations/s"
          },
          {
            "name": "jason: map => iodata",
            "value": 167.0860974741863,
            "unit": "iterations/s"
          },
          {
            "name": "otp json: map => binary",
            "value": 163.13305094630368,
            "unit": "iterations/s"
          },
          {
            "name": "jason: map => binary",
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
            "name": "encode proplist → iodata (1.2 KB bid response)",
            "value": 836728.5861857742,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (1.2 KB bid response)",
            "value": 833790.5882608885,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (1.2 KB bid response)",
            "value": 677128.8431276128,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (1.2 KB bid response)",
            "value": 675392.8571984564,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 253.05893828712746,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → iodata (750 KB Twitter)",
            "value": 686.1787810581776,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (750 KB Twitter)",
            "value": 681.5943291646644,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (750 KB Twitter)",
            "value": 570.325945767721,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (750 KB Twitter)",
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
            "name": "encode proplist → binary (1.2 KB bid response)",
            "value": 831376.5963695382,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → iodata (1.2 KB bid response)",
            "value": 830201.2503719146,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (1.2 KB bid response)",
            "value": 666640.7298980021,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (1.2 KB bid response)",
            "value": 661176.7079693419,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 216.51512685224975,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (750 KB Twitter)",
            "value": 668.4235222531742,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → iodata (750 KB Twitter)",
            "value": 665.0309192951541,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (750 KB Twitter)",
            "value": 558.6617231940041,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (750 KB Twitter)",
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
            "name": "encode proplist → iodata (1.2 KB bid response)",
            "value": 792835.2606492537,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (1.2 KB bid response)",
            "value": 777902.2030622904,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (1.2 KB bid response)",
            "value": 659336.9744439729,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (1.2 KB bid response)",
            "value": 652879.8251613943,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 251.24512533297664,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (750 KB Twitter)",
            "value": 760.9798445731492,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → iodata (750 KB Twitter)",
            "value": 755.4035125642438,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (750 KB Twitter)",
            "value": 600.1607466942982,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (750 KB Twitter)",
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
            "name": "encode proplist → iodata (1.2 KB bid response)",
            "value": 776163.150413194,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (1.2 KB bid response)",
            "value": 725423.0878002102,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (1.2 KB bid response)",
            "value": 629729.7244229803,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (1.2 KB bid response)",
            "value": 621845.7291249469,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 387.9986823564748,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (750 KB Twitter)",
            "value": 506.0988830818231,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → iodata (750 KB Twitter)",
            "value": 505.1026291393998,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (750 KB Twitter)",
            "value": 428.72043359491084,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (750 KB Twitter)",
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
            "name": "encode proplist → iodata (1.2 KB bid response)",
            "value": 775581.2920901085,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (1.2 KB bid response)",
            "value": 758317.2108459033,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (1.2 KB bid response)",
            "value": 643040.4578453205,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (1.2 KB bid response)",
            "value": 642848.5770376071,
            "unit": "iterations/s"
          },
          {
            "name": "decode (750 KB Twitter)",
            "value": 386.92417108590627,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → iodata (750 KB Twitter)",
            "value": 608.9262417278887,
            "unit": "iterations/s"
          },
          {
            "name": "encode proplist → binary (750 KB Twitter)",
            "value": 607.7436629116514,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → binary (750 KB Twitter)",
            "value": 486.4650377913799,
            "unit": "iterations/s"
          },
          {
            "name": "encode map → iodata (750 KB Twitter)",
            "value": 483.7895857873691,
            "unit": "iterations/s"
          }
        ]
      }
    ]
  }
}