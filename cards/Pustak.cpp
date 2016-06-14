#include "cards/Pustak.hpp"

using namespace Cards;

string Pustak::getName(){
    return "pustak";
}

CardPtr Pustak::makeNew(){
    return make_shared<Pustak>();
}

vector<CardPtr>& Pustak::getAppliedCards(){
    return appliedCards;
}

int& Pustak::getCUID(){
    return cuid;
}

bool& Pustak::getActiveState(){
    return active;
}

void Pustak::played(GameServer& game){
    //does nothing
}
