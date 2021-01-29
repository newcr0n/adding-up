'use strict';
const fs = require('fs');
const readline = require('readline');
//上２行でNode.jsに用意されたモジュールを呼び出す。
//fsはFileSystemの略で、ファイルを扱うモジュールで、readlineはファイルを一行ずつ読み込むためのモジュール
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
//以上の部分はpopu-pref.csvから、ファイルを読み込みを行うStreamを生成し、さらにそれをreadlineオブジェクトのinput
//として設定しrlオブフェクトを作成している
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト
rl.on('line', lineString => {
    const columns = lineString.split(','); //lineStringで与えられた文字列を,で分割してcolumns配列にする
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);//parseIntは文字列を整数値に変換する関数
    //上３行では配列columnsの要素へ並び順の番号でアクセスして、集計年,都道府県,人工をそれぞれ変数に保存
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture); //保存したイブジェクトを取得
    if (!value) {
            value = {
            popu10: 0,
            popu15: 0,
            change: null
        };
    } //連想配列prefectureDataMapからデータを取得
    if (year === 2010) {
        value.popu10 = popu;
    }
    if (year === 2015) {
        value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
    }
    //年の数値が2010または2015であるデータのみをコンソールに出力
});
//rlオブジェクトでlineというイベントが発生したらこの無名関数を呼んでくださいという意味
rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
      value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
      return pair2[1].change - pair1[1].change;
    });
    const rankingStrings = rankingArray.map(([key, value]) => {
      return (
        key +
        ': ' +
        value.popu10 +
        '=>' +
        value.popu15 +
        ' 変化率:' +
        value.change
      );
    }); /*この場合のmapは先程の連想配列のMapとは別のもので、map関数という。連想数列Mapとmap関数は別物！
    つまりこの部分では、「Mapのキーと値が要素になった配列を要素[key,value]として受け取り、それを文字列に
    変換する」処理を行っている。*/
    console.log(rankingStrings);
  });