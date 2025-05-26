const container = document.getElementById('game-container');

document.getElementById('btn-bigger-smaller').onclick = initBiggerSmaller;
document.getElementById('btn-tic-tac-toe').onclick = initTicTacToe;
document.getElementById('btn-minesweeper').onclick = initMinesweeper;

function clearContainer() {
    container.innerHTML = '';
}

// Игра "Больше-Меньше"
function initBiggerSmaller() {
    clearContainer();
    let number = Math.floor(Math.random() * 100) +1;
    let guessInput = document.createElement('input');
    guessInput.type = 'number';
    guessInput.placeholder = 'Введите число';

    let guessBtn = document.createElement('button');
    guessBtn.textContent = 'Угадать';

    let message = document.createElement('p');

    container.appendChild(guessInput);
    container.appendChild(guessBtn);
    container.appendChild(message);

    guessBtn.onclick = () => {
        const guess = parseInt(guessInput.value);
        if (isNaN(guess)) {
            message.textContent = 'Пожалуйста, введите число.';
            return;
        }
        if (guess === number) {
            message.textContent = 'Поздравляю! Вы угадали!';
        } else if (guess < number) {
            message.textContent = 'Больше!';
        } else {
            message.textContent = 'Меньше!';
        }
    };
}

// Игра "Крестики-нолики"
function initTicTacToe() {
    clearContainer();
    const size = 3; // Можно сделать выбор размера
    const board = Array(size).fill(null).map(() => Array(size).fill(null));
    let currentPlayer = 'X';

    const table = document.createElement('table');
    table.style.margin = '0 auto';

    for (let i=0; i<size; i++) {
        const row = document.createElement('tr');
        for (let j=0; j<size; j++) {
            const cell = document.createElement('td');
            cell.style.border='1px solid black';
            cell.style.width='50px';
            cell.style.height='50px';
            cell.style.fontSize='24px';
            cell.style.textAlign='center';
            cell.style.cursor='pointer';

            cell.onclick= () => {
                if (!cell.textContent) {
                    cell.textContent= currentPlayer;
                    board[i][j]= currentPlayer;
                    if (checkWin(board, currentPlayer)) {
                        alert(`Победил ${currentPlayer}`);
                        initTicTacToe();
                    } else if (isDraw(board)) {
                        alert('Ничья!');
                        initTicTacToe();
                    } else {
                        currentPlayer= currentPlayer==='X' ? 'O' : 'X';
                    }
                }
            };
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    container.appendChild(table);
}

function checkWin(board, player) {
    const size=board.length;

    // Проверка строк
    for(let i=0; i<size; i++) {
        if (board[i].every(cell => cell===player)) return true;
    }

    // Проверка столбцов
    for(let j=0; j<size; j++) {
        let win=true;
        for(let i=0; i<size; i++) {
            if (board[i][j]!==player) {win=false; break;}
        }
        if(win) return true;
    }

    // Диагональ /
    let win=true;
    for(let i=0;i<size;i++){
        if(board[i][i]!==player){win=false;break;}
    }
    if(win) return true;

    // Диагональ \
    win=true;
    for(let i=0;i<size;i++){
        if(board[i][size -1 -i]!==player){win=false;break;}
    }
    return win;
}

function isDraw(board) {
    return board.flat().every(cell => cell !== null);
}

// Игра "Мины"
function initMinesweeper() {
    clearContainer();

    const sizeInput= document.createElement('input');
    sizeInput.type='number';
    sizeInput.placeholder='Размер поля';
    sizeInput.value=9;

    const minesInput= document.createElement('input');
    minesInput.type='number';
    minesInput.placeholder='Количество мин';

    const startBtn= document.createElement('button');
    startBtn.textContent='Начать игру';

   container.appendChild(sizeInput);
   container.appendChild(minesInput);
   container.appendChild(startBtn);

   startBtn.onclick= ()=> {
       const size= parseInt(sizeInput.value);
       const minesCount= parseInt(minesInput.value);
       if(isNaN(size)||isNaN(minesCount)||size<5||minesCount>=size*size){
           alert('Некорректные параметры');
           return;
       }
       startMinesweeper(size,minesCount);
   };
}

function startMinesweeper(size, minesCount) {
   container.innerHTML='';
   const field=[];

   // Создаем поле
   for(let i=0;i<size;i++){
       field[i]=[];
       for(let j=0;j<size;j++){
           field[i][j]={mine:false, revealed:false, neighborMines:0};
       }
   }

   // Расставляем мины
   let placedMines=0;
   while(placedMines<minesCount){
       const x=Math.floor(Math.random()*size);
       const y=Math.floor(Math.random()*size);
       if(!field[x][y].mine){
           field[x][y].mine=true;
           placedMines++;
       }
   }

   // Подсчет соседних мин
   for(let i=0;i<size;i++){
       for(let j=0;j<size;j++){
           if(!field[i][j].mine){
               let count=0;
               for(let dx=-1;dx<=1;dx++){
                   for(let dy=-1;dy<=1;dy++){
                       const nx=i+dx, ny=j+dy;
                       if(nx>=0 && ny>=0 && nx<size && ny<size){
                           if(field[nx][ny].mine) count++;
                       }
                   }
               }
               field[i][j].neighborMines=count;
           }
       }
   }

   // Создаем таблицу
   const table=document.createElement('table');
   table.style.borderCollapse='collapse';

   for(let i=0;i<size;i++){
       const row=document.createElement('tr');
       for(let j=0;j<size;j++){
           const cell=document.createElement('td');
           cell.style.width='30px';
           cell.style.height='30px';
           cell.style.border='1px solid black';
           cell.style.textAlign='center';
           cell.style.cursor='pointer';

           cell.onclick=(e)=>{
               revealCell(i,j);
               checkWinCondition();
           };

           function revealCell(x,y){
               if(field[x][y].revealed) return;
               field[x][y].revealed=true;

               if(field[x][y].mine){
                   cell.textContent='💣';
                   alert('Игра окончена! Вы проиграли.');
                   revealAll();
               } else{
                   if(field[x][y].neighborMines>0){
                       cell.textContent=field[x][y].neighborMines;
                   } else{
                       cell.textContent='';
                       // Раскрываем соседние клетки рекурсивно
                       for(let dx=-1;dx<=1;dx++){
                           for(let dy=-1;dy<=1;dy++){
                               const nx=x+dx, ny=y+dy;
                               if(nx>=0 && ny>=0 && nx<size && ny<size){
                                   revealCell(nx,ny);
                               }
                           }
                       }
                   }
               }

               function revealAll(){
                   for(let xi=0;xi<size;xi++){
                       for(let yj=0;yj<size;yj++){
                           if(!field[xi][yj].revealed){
                               field[xi][yj].revealed=true;
                               const c=document.querySelector(`td:nth-child(${yj+1})`);
                               c.textContent=(field[xi][yj].mine)?'💣':(field[xi][yj].neighborMines||'');
                           }
                       }
                   }
               }

           }

           row.appendChild(cell);
       }
       table.appendChild(row);
   }

   container.appendChild(table);

   function checkWinCondition() {
       let unrevealedCount=0;
       for(let i=0;i<size;i++){
           for(let j=0;j<size;j++){
               if(!field[i][j].revealed && !field[i][j].mine){
                   unrevealedCount++;
               }
           }
       }

       if(unrevealedCount===0){
           alert('Поздравляем! Вы выиграли!');
       }
   }

}
