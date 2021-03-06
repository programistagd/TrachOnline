#include <iostream>
#include <thread>
#include <chrono>

#include "seasocks/PrintfLogger.h"
#include "seasocks/Server.h"

#include "Message.hpp"
#include "GameServer.hpp"

using namespace std;
using namespace seasocks;
using namespace nlohmann;

int main() {
    Server server(make_shared<PrintfLogger>(PrintfLogger::Level::INFO));
    shared_ptr<GameServer> game = make_shared<GameServer>();
    server.addWebSocketHandler("/ws", game);
    volatile bool running = true;
    thread consoleThread([&](){
		while(running){
			string command;
			cin>>command;
			if(command=="start"){
				server.execute([&](){
					game->startPlaying();
				});
			}else{
				cout<<"Unrecognized command"<<endl;
			}
		}
	});
    thread tickerThread([&](){
		while(running){
            server.execute([&](){
                game->tick();
            });
            this_thread::sleep_for(chrono::seconds(1));
		}
	});
    server.serve("../web", 3000);
    running = false;
    consoleThread.join();
}
