/* 
    solution.js - Provides a "glue layer" between a webpage and an HTTP server
    Copyright (C) 2018 Alexander Ozero

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

class Gambler {
    
    constructor(url, token) {
        this.url = url;
        this.token = token;
        
        localStorage.setItem('token', this.token);
        
        // Fetch the hello page and print the message to console
        fetch(this.url)
            .then(function(response) {
                return response.text();
            })
            .then(function(text) {
                console.log(text);
            });
            
        // Fetch the sit page and post the token to it
        var data = new FormData();
        data.set('token', this.token);
        
        fetch(this.url+"sit", { method: "POST", body: data })
            .then(function(response) {
                document.querySelector("output[name='up']").innerHTML = response.statusText;
                return response.json();
            })
            .then(function(myJson) {
                if (localStorage.getItem('data')) {
                    // Do nothing
                }
                
                else {
                    localStorage.setItem('data', JSON.stringify(myJson));
                }
                
                console.log(myJson);
            });
        
        var localData = JSON.parse( localStorage.getItem('data') );
        
        document.querySelector("output[name='money']").innerHTML = localData.money;
        document.querySelector("output[name='session']").innerHTML = localData.session;
        
        if (localData.game) {
            
            var dh = localData.game.dealer_hand;
            var ph = localData.game.player_hand;
            
            for (var i = 0; i < dh.length; i++) {
                if (dh[i] == 1) {
                    dh[i] = 'A';
                }
                else if (dh[i] == 11) {
                    dh[i] = 'J';
                }
                else if (dh[i] == 12) {
                    dh[i] = 'Q';
                }
                else if (dh[i] == 13) {
                    dh[i] = 'K';
                }
            }
            
            for (var i = 0; i < ph.length; i++) {
                if (ph[i] == 1) {
                    ph[i] = 'A';
                }
                else if (ph[i] == 11) {
                    ph[i] = 'J';
                }
                else if (ph[i] == 12) {
                    ph[i] = 'Q';
                }
                else if (ph[i] == 13) {
                    ph[i] = 'K';
                }
            }
            
            document.querySelector("output[name='dealer_hand']").innerHTML = dh;
            document.querySelector("output[name='player_hand']").innerHTML = ph;
            document.querySelector("output[name='last_bet']").innerHTML = localData.bet;
            
            document.querySelector("button[name='betButton']").disabled = true;
            document.querySelector("input[name='bet']").disabled = true;
        }
        else {
                document.querySelector("button[name='stand']").disabled = true;
                document.querySelector("button[name='hit']").disabled = true;
                document.querySelector("button[name='double_down']").disabled = true;
                document.querySelector("button[name='surrender']").disabled = true;
        }
    };
    
    bet(amount) {
        this.update("/bet", amount);
    }
    
    stand() {
        this.update("/stand");
    }
    
    hit() {
        this.update("/hit");
    }
    
    double_down() {
        this.update("/double_down");
    }
    
    surrender() {
        this.update("/surrender");
    }
        
    update(action, amount=null) {
        var localData = JSON.parse( localStorage.getItem('data') );
        var data = new FormData();
        var token = localStorage.getItem('token');
        data.set('token', token);
        
        if (action == "/bet") {
            data.set('amount', amount);
        }
        
        fetch(this.url+ localData.session + action, { method: "POST", body: data })
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                localStorage.setItem('data', JSON.stringify(myJson));
                console.log(myJson);
                localData = JSON.parse( localStorage.getItem('data') );
                
                if (localData.game) {
                    document.querySelector("output[name='last_bet']").innerHTML = localData.game.bet;
                    var dh = localData.game.dealer_hand;
                    var ph = localData.game.player_hand;
                    
                    for (var i = 0; i < dh.length; i++) {
                        if (dh[i] == 1) {
                            dh[i] = 'A';
                        }
                        else if (dh[i] == 11) {
                            dh[i] = 'J';
                        }
                        else if (dh[i] == 12) {
                            dh[i] = 'Q';
                        }
                        else if (dh[i] == 13) {
                            dh[i] = 'K';
                        }
                    }
                    
                    for (var i = 0; i < ph.length; i++) {
                        if (ph[i] == 1) {
                            ph[i] = 'A';
                        }
                        else if (ph[i] == 11) {
                            ph[i] = 'J';
                        }
                        else if (ph[i] == 12) {
                            ph[i] = 'Q';
                        }
                        else if (ph[i] == 13) {
                            ph[i] = 'K';
                        }
                    }
            
                    document.querySelector("output[name='dealer_hand']").innerHTML = dh;//localData.game.dealer_hand;
                    document.querySelector("output[name='player_hand']").innerHTML = ph;//localData.game.player_hand;
                    
                    document.querySelector("button[name='betButton']").disabled = true;
                    document.querySelector("input[name='bet']").disabled = true;
                    
                    document.querySelector("button[name='stand']").disabled = false;
                    document.querySelector("button[name='hit']").disabled = false;
                    document.querySelector("button[name='double_down']").disabled = false;
                    document.querySelector("button[name='surrender']").disabled = false;
                }
                else if (localData.last_game) {
                    document.querySelector("output[name='last_bet']").innerHTML = localData.last_game.bet;
                    document.querySelector("output[name='dealer_hand']").innerHTML = localData.last_game.dealer_hand;
                    document.querySelector("output[name='player_hand']").innerHTML = localData.last_game.player_hand;
                    document.querySelector("output[name='result']").innerHTML = localData.last_game.result;
                    document.querySelector("output[name='won']").innerHTML = localData.last_game.won;
                    document.querySelector("output[name='money']").innerHTML = localData.money;
                    
                    document.querySelector("button[name='betButton']").disabled = false;
                    document.querySelector("input[name='bet']").disabled = false;
                    
                    document.querySelector("button[name='stand']").disabled = true;
                    document.querySelector("button[name='hit']").disabled = true;
                    document.querySelector("button[name='double_down']").disabled = true;
                    document.querySelector("button[name='surrender']").disabled = true;
                    
                    var dh = localData.last_game.dealer_hand;
                    var ph = localData.last_game.player_hand;
                    
                    for (var i = 0; i < dh.length; i++) {
                        if (dh[i] == 1) {
                            dh[i] = 'A';
                        }
                        else if (dh[i] == 11) {
                            dh[i] = 'J';
                        }
                        else if (dh[i] == 12) {
                            dh[i] = 'Q';
                        }
                        else if (dh[i] == 13) {
                            dh[i] = 'K';
                        }
                    }
                    
                    for (var i = 0; i < ph.length; i++) {
                        if (ph[i] == 1) {
                            ph[i] = 'A';
                        }
                        else if (ph[i] == 11) {
                            ph[i] = 'J';
                        }
                        else if (ph[i] == 12) {
                            ph[i] = 'Q';
                        }
                        else if (ph[i] == 13) {
                            ph[i] = 'K';
                        }
                    }
                    
                    document.querySelector("output[name='dealer_hand']").innerHTML = dh;
                    document.querySelector("output[name='player_hand']").innerHTML = ph;
                }
            });
    }
}

