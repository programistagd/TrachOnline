#ifndef PELNAREGENERACJA_HPP
#define PELNAREGENERACJA_HPP

#include "cards/Playable.hpp"
#include "cards/Targetable.hpp"

namespace Cards{
class PelnaRegeneracja : public Playable, public Targetable{
public:
    string getName() override;
    bool canBePlayedAt(CardPtr card, GameServer* game) override;
    CardPtr makeNew() override;
    vector<CardPtr>& getAppliedCards() override;

    int& getOwnerId() override;
	int& getCUID() override;
    bool& getActiveState() override;

    void reset() override;
    void played(GameServer& game) override;

    inline virtual ~PelnaRegeneracja(){}
protected:
    vector<CardPtr> appliedCards;
    int cuid;
    bool active=true;
	int ownerid=-1;
};
}

#endif