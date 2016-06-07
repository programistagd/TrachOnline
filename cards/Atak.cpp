#include "cards/Atak.hpp"

using namespace Cards;

Atak::Atak(){
    value = 1;
}

string Atak::getName(){
    return "atak";
}

bool Atak::canBePlayedAt(CardPtr card){
    if(card==nullptr) return true;//TODO
    return false;
}

CardPtr Atak::makeNew(){
    return make_shared<Atak>();
}

vector<CardPtr>& Atak::getAppliedCards(){
    return appliedCards;
}

void Atak::played(){
   //TODO 
}
