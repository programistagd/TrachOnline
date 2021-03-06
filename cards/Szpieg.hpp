#ifndef SZPIEG_HPP
#define SZPIEG_HPP

#include "cards/Playable.hpp"
#include "cards/Targetable.hpp"
#include "cards/BaseCardImpl.hpp"

namespace Cards{
class Szpieg : public Playable, public Targetable, public BaseCardImpl{
public:
    string getName() override;
    CardPtr makeNew() override;

    void reset() override;
    void played(GameServer& game) override;

    bool canBeTargetedAt(Target t) override;

    inline virtual ~Szpieg(){}
};
}

#endif
