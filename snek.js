$(document).ready(function(){
    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 600;
    let boardSize = 30;
    let cellSize = 20;
    let keyPrsd = 2;

    window.addEventListener("keydown", function(e) 
    {
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) 
        {
            e.preventDefault();
        }
    }, false);

    document.addEventListener("keydown", keyDwnHndlr, true);

    function keyDwnHndlr(e)
    {
        let prvKeyPrsd = keyPrsd;

        switch(e.key)
        {
            case "ArrowRight":
            case "Right":
                { 
                    keyPrsd = 2;
                    break;
                }
            case "ArrowLeft":
            case "Left":
                {  
                    keyPrsd = 3;
                    break;
                }
            case "ArrowUp":
            case "Up":
                {            
                   keyPrsd = 4;
                   break;
                }
            case "ArrowDown":
            case "Down":
                {               
                    keyPrsd = 5;
                    break;
                }
        }

        if(keyPrsd * prvKeyPrsd == 6 || keyPrsd * prvKeyPrsd == 20)
        {
            keyPrsd = prvKeyPrsd;
        }
    }

    let snake = 
    {
        x: Math.floor(Math.random() * boardSize), 
        y: Math.floor(Math.random() * boardSize), 
        length: 1, prevx: [], prevy: [], dir: 2,
        setDirection(dir)
        {
            if(!(this.dir * dir == 6 || this.dir * dir == 20))
            {
                this.dir = dir;
            }
        },
        draw: function()
        {
            ctx.beginPath();
            ctx.rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
            ctx.fillStyle = "rgb(100, 100, 100)";
            ctx.fill();
            ctx.closePath();

            for(let i = 0; i < this.length - 1; i++)
            {
                ctx.beginPath();
                ctx.rect(this.prevx[i] * cellSize, this.prevy[i] * cellSize, cellSize, cellSize);
                ctx.fillStyle = "rgb(100, 100, 100)";
                ctx.fill();
                ctx.closePath();
            }
        },
        move: function()
        {

            this.prevx.unshift(this.x);
            this.prevy.unshift(this.y);

            while(this.prevx.length > this.length + 1)
            {
                this.prevx.pop();
            }

            while(this.prevy.length > this.length + 1)
            {
                this.prevy.pop();
            }

            switch(this.dir)
            {
                case 2:
                    {
                        this.x++;
                        break;
                    }
                case 3:
                    {
                        this.x--;
                        break;
                    }
                case 4:
                    {
                        this.y--;
                        break;
                    }
                case 5:
                    {
                        this.y++;
                        break;
                    }
            }

            if(this.x < 0)
            {
                this.x = boardSize - 1;
            }
            else if(this.x > boardSize - 1)
            {
                this.x = 0;
            }
            else if(this.y < 0)
            {
                this.y = boardSize - 1;
            }
            else if(this.y > boardSize - 1)
            {
                this.y = 0;
            }
        }
    };

    let food = 
    {
        x: Math.floor(Math.random() * boardSize), 
        y: Math.floor(Math.random() * boardSize),
        relocate: function()
        {
            let ifRelocated = false
            do
            {
                this.x = Math.floor(Math.random() * boardSize);
                this.y = Math.floor(Math.random() * boardSize);
                
                for(let i = 0; i < snake.length - 1; i++)
                {
                    if(snake.prevx[i] == food.x && snake.prevy[i] == food.y)
                    {
                        ifRelocated = true;
                        this.x = Math.floor(Math.random() * boardSize);
                        this.y = Math.floor(Math.random() * boardSize);
                    }
                }

            } while(this.x == snake.x && this.y == snake.y && (!ifRelocated));
        },
        draw: function()
        {
            ctx.beginPath();
            ctx.fillStyle = "rgb(255, 10, 50)";
            ctx.fillRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
            ctx.closePath();
        }
    };

    function drawScore()
    {
        ctx.font = "20px Arial";
        ctx.fillStyle = "rgb(100, 100, 100)";
        ctx.fillText("Score: " + ((snake.length - 1) * 10), canvas.width - 150, 20);
    }

    function draw()
    {
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, 800, 600);
        ctx.fillStyle = "rgb(165, 165, 165)";
        ctx.fillRect(600, 0, 1, 600);
        snake.draw();
        food.draw();
        snake.setDirection(keyPrsd);
        snake.move();

        for(let i = 0; i < snake.length - 1; i++)
        {
            if(snake.x == snake.prevx[i] && snake.y == snake.prevy[i])
            {
                alert("GAME OVER\nscore: " + (snake.length - 1) * 10);
                document.location.reload();
                clearInterval(interval);
            }
        }

        if(snake.x == food.x && snake.y == food.y)
        {
            snake.length++;
            food.relocate();
        }

        drawScore();
    }

    let interval = setInterval(draw, 100);
});