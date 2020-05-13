'use strict';

{
   // -----------------------------------------------------------------
   // パネルのクラス
   // -----------------------------------------------------------------
   class Panel {

      // Gameクラスのインスタンスを受け取る
      constructor(game) { //インスタンス生成(Panelの)

         this.game = game; // プロパティにする

         this.el = document.createElement('li'); // liタグを作成
         this.el.classList.add('pressed'); // class="pressed" をつける

         // liタグのクリックイベント
         this.el.addEventListener('click', () => {

            this.check(); // checkメソッド呼び出し
         });
      }

      // ■ getElメソッド (Boardクラスで使うため)...カプセル化
      getEl() {
         return this.el;
      }

      // ■ activateメソッド
      activate(num) {

         this.el.classList.remove('pressed');// パネルから class="pressed" を外す
         this.el.textContent = num; // liタグに num(数字) を追加
      }

      // ■ checkメソッド
      check() {

         // クリックした数字が合っている場合 (getCurrentNumメソッド呼び出し)
         if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) { // parseInt…文字列を数値に変える

            // 押し込む(class="pressed" をつける)
            this.el.classList.add('pressed');

            // 次の数字を選びるようにする
            this.game.addCurrentNum(); // addCurrentNumメソッド呼び出し

            // currentNum が 4 だった場合 (getCurrentNumメソッド呼び出し)
            if (this.game.getCurrentNum() == 4) {

               // タイマーを止める
               clearTimeout(this.game.getTimeoutId()); // getTimeouIdメソッド呼び出し
            }
         }
      }
   }

   // =================================================================

   // -----------------------------------------------------------------
   // パネルを管理する(ボード)クラス
   // -----------------------------------------------------------------
   class Board { 

      // Gameクラスのインスタンスを受け取る
      constructor(game) { // インスタンス生成(Boardの)

         this.game = game; // Panelクラスに渡すためにプロパティにする

         this.panels = []; // パネルの配列

         // パネルを4枚作る
         for(let i = 0; i < 4; i++) {

            // panels 配列に要素を追加(push)  
            this.panels.push(new Panel(this.game)); // パネルクラスを4枚保持
                        // Gameクラスのインスタンスを渡す
         }

         this.setup(); // setupメソッド呼び出し
      }

      // ■ setupメソッド
      setup() {

         const board = document.getElementById('board'); //ulタグのid="board"を取得

         // パネル の数だけ要素を追加
         this.panels.forEach(panel => {

            // board.appendChild(panel.el);✖ // カプセル化を使う(クラスの外だから)
            board.appendChild(panel.getEl()); // getElメソッド経由で取得
         });
      }

      // ■ activateメソッド
      activate() {

         // 配置する数字を配列で初期化
         const nums = [0, 1, 2, 3];

         // 配置する数字をランダムに選ぶ
         this.panels.forEach(panel => {

            // ランダムな位置から1つ取り出す [0]・・・中身を取り出す必要があるため
            const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
            
            // ランダムな数字を配置
            panel.activate(num); // panel の方にも
         });
      }
   }

   // ================================================================================

   // -------------------------------------------------------------------------------
   // ゲームに関するクラス
   // -------------------------------------------------------------------------------
   class Game {

      constructor() { // インスタンス生成(Gameの)

         // インスタンス生成(Boardの)
         this.board = new Board(this); // BordクラスのコンストラクタにGameクラスのインスタンスを渡す

         
         this.currentNum = undefined; // ボタンを順番に押し込むための変数を宣言
         this.startTime = undefined; // スタートする時の時間の変数を宣言
         this.timeoutId = undefined; // タイマーを止めるための変数を宣言

         // id="btn" を取得
         const btn = document.getElementById('btn'); // 他で使わないのでconstのまま

         // スタートボタンのクリックイベント
         btn.addEventListener('click', () => { 

            this.start(); // startメソッド呼び出し
         });
      }

      // ■ startメソッド
      start() {

         // 既にタイマーが走っている場合
         if (typeof this.timeoutId !== 'undefined') {

            // タイマーを止める
            clearTimeout(this.timeoutId);
         }

         this.currentNum = 0; // ボタンをクリックする順番を 0 に戻す

         this.board.activate(); // activateメソッド呼び出し

         this.startTime = Date.now(); // 現在時刻を保持

         this.runTimer(); // runTimerメソッド呼び出し
      }

      // ■ runTimerメソッド(タイマーを走らせる)
      runTimer() {

         const timer = document.getElementById('timer'); // id="timer" を取得 他で使わないからconstのまま

         // 時刻を更新 
         timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

         // 全てのパネルをクリックしたらタイマーを止める
         this.timeoutId = setTimeout(() => { // setTimeoutメソッドで runTimerメソッド 呼び出す

            this.runTimer();
         }, 10); // 10ミリ秒後に呼び出す
      }


      // ■ addCurrentNumメソッド
      addCurrentNum() {

         // 次の数字を選びるようにするため + 1
         this.currentNum++;
      }

      // ■ getCurrentNumメソッド
      getCurrentNum() {

         return this.currentNum;
      }

      // ■ getTimeoutIdメソッド
      getTimeoutId() {

         return this.timeoutId;
      }
   }

   // =================================================================================
   
   new Game(); // インスタンス生成(Gameの)
}
 