var socket = new Socket('ws://' + document.location.host + '/ws');
var player = [];
var myCards = [];
var me = {};
var targetableList = ['atak']

$(document).ready(function(){
    $(".view").hide();
    show("connecting");
    $("#cardDrop").hide();
});

function show(type){
    $(".view").hide(90);
    $("#"+type).show(200);
};

socket.on('connected',function(){
    $("#loginSubmit").click(function(){
        if($("#nickname").val()==""||$("#nickname").val()=="???") return;
        socket.emit("login",{nickname:$("#nickname").val()});
        show("waiting");
    });
    $("#startGame").click(function(){
        socket.emit("requestStart");
    });
    show("login");
});

socket.on('updateUsers',function(update){
    player.length=update.length;
    console.log(update);
    for(var i=0;i<update.length;i++){
        player[i]={};
        player[i].id=update[i].id;
        player[i].maxHP=update[i].maxHP;
        player[i].HP=update[i].HP;
        player[i].cardsAmount=update[i].cardsAmount;
        player[i].avatar=update[i].avatar;
        player[i].username=update[i].username;
    }
    showPlayerStatistics();
});

function getPlayerById(idd){
  for(var i;i<player.length;i++){
    if(player[i].id === id) return player[i];
  }
}

socket.on('error',function(err){
    console.log(err);
    show("connectionLost");
    $("#connectionLostReason").html(err);
});

socket.on('init', function(init){
    show("playing");
    me.id=init.id;
    me.username=init.username;
    me.avatar=init.avatar;
    showMe();
})
var currentThrower = -1;
socket.on('updateTurn', function(update){
    $("#cardDrop").hide();
    $(".p"+currentThrower).removeClass("bold");
    currentThrower=update.currentPid;
    refreshThrower();
});

function refreshThrower(){
    $(".p"+currentThrower).addClass("bold");
    if(currentThrower==me.id){
        console.log("My turn!");
        $("#cardDrop").show();
        $("#cardDrop").droppable(
          {
            drop: function( event, ui ) {
              ui.draggable.hide();
              var thrown = ui.draggable.attr('id');
              var thrownId = thrown.substr(5,thrown.length-5);
              handleAction(thrownId,-1);

            },
          }
        )
      }
}

function handleAction(cardId,onCardId){
  var targetable = checkTargetable(myCards[cardId]);
  if(targetable){
    $("#chosePlayerModal").modal('show');
    $('#chosePlayerModal').modal({backdrop: 'static', keyboard: false})
    for(var i=0;i<player.length;i++){
      var p = player[i];
      $("#player"+i).click(function(){
        socket.emit('playCard',{id:parseInt(cardId),attachTo:parseInt(onCardId),target:p.id})
      $("#chosePlayerModal").modal('hide');
      })

    }
  }
  else{
    socket.emit('playCard',{id:parseInt(cardId),attachTo:parseInt(onCardId)})
  }
}

function checkTargetable(card){
  for(var i=0;i<targetableList.length;i++){
    if(card==targetableList[i]) return true;
  }
  return false;
}

socket.on('updateCards', function(update){
    myCards=update;
    console.log("karty");
    console.log(myCards);
    showCards();
});

function showPlayerStatistics(){
    var innerPlayerList ="";
    for(var i=0;i<player.length;i++){
        var j = i+1;
        innerPlayerList +='<li class="list-group-item p'+player[i].id+'"><img class="img-thumbnail" src="/avatars/'+player[i].avatar+'.jpg">'+player[i].username;
        innerPlayerList +='  HP='+player[i].HP+'/'+player[i].maxHP+' ';
        innerPlayerList +='KnR='+player[i].cardsAmount;
        innerPlayerList +='</li>';
    }
    $(".playerList").html(innerPlayerList);
    refreshThrower();

    var innerChosePlayer = '';
    for(var i=0;i<player.length;i++){
      innerChosePlayer += '<li class="list-group-item"><img  id="player'+i+'" class="img-thumbnail" src="/avatars/'+player[i].avatar+'.jpg">'+player[i].username+'</li>'
    }
    $("#chosePlayer").html(innerChosePlayer);
}

function showCards(){
    var innerCards='';
    for(var i=0;i<myCards.length;i++){
        innerCards+="<a href='/cards/"+myCards[i]+".jpg' data-lightbox = 'image-1'><img  id = 'karta"+i+"' src='/cards/"+myCards[i]+".jpg' class='cardImages'></a>";
      }
    $("#cards").html(innerCards);
    $(".cardImages").draggable({
      revert: true
    });
}

function showMe(){
    var innerMe='';
    innerMe+='<img src="/avatars/'+me.avatar+'.jpg"> '+me.username;
    $("#me").html(innerMe);
}

socket.on('updateTurnTable',function(cards){
console.log('turntable',cards);
$("#gameArea").html("");
  for(var i=0;i<cards.length;i++){
    var parent = $("#gameArea");
    handleCard(cards[i],parent);
  }

});
//test
var test1 = {
  name: "pustak",
  id: 2,
  attached: []
};
var test2 = {
  name:"obrona",
  id: 4,
  attached: []
};
var test3 = {
  name:"atak",
  id: 3,
  attached:[test1]
};

var test4 = {
  name:"obrona",
  id: 5,
  attached: []
};

var test5 = {
  name: "przerzut",
  id: 1,
  attached: [test3,test4]
};
//handleCard(test5,$("#gameArea"));
//end test

function handleCard(card,parent){
    console.log(card);
  var innerCard = '';

  if(true || card.from === undefined){
    innerCard = "<div class='tableContainerClass' id = 'tableContainer"+card.id+"'><img class='tableCardClass' id='tableCard"+card.id+"'src='/cards/"+card.name+".jpg'></div>"
  }

  else{
    var fromAvatar = getPlayerById(card.from).avatar;
    var toAvatar = getPlayerById(card.to).avatar;
    innerCard = "<div class='tableContainerClass' id = 'tableContainer"+card.id+"'><img class='tableCardClass' src='/avatars/"+fromAvatar+".jpg'><img id='tableCard"+card.id+"'src='/cards/"+card.name+".jpg'><img src='/avatars/"+toAvatar+".jpg'</div>"
  }

  $("#tableCard"+card.id).droppable({
    drop: function(event, ui){
      var thrown = ui.draggable.attr('id');
      var thrownId = thrown.substr(5,thrown.length-5);
      var thrownAt = $(this).attr('id');
      thrownAt = thrownAt.substr(9, thrownAt.length-9);
      handleAction(thrownId,-1);

    }
  })
  parent.append(innerCard);

  var cardContainer = $("#tableContainer"+card.id)


  if(card.attached.length>0){
    cardContainer.append("<br><hr><div id='childrenContainer"+card.id+"'>");
    for(var x=0;x<card.attached.length;x++){
      handleCard(card.attached[x],cardContainer)
    }

    cardContainer.append("</div>");
  }

}

socket.on('updateTiming',function(seconds){
  $("#chat").html("Do końca tury zostało "+seconds+" sekund")
})
