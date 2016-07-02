#ifndef BERSERK_HPP
#define BERSERK_HPP

#include "cards/Feature.hpp"
#include "cards/Enhanceable.hpp"
#include "cards/BaseCardImpl.hpp"

namespace Cards{
class Berserk : public Feature, public Enhanceable, public BaseCardImpl{
public:
    string getName() override;
    CardPtr makeNew() override;
    
    void reset() override;
    void apply(GameServer::Player&) override;

    inline virtual ~Berserk(){}
};
}

#endif

