#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

#include <rednet-p2p.h>

#define JOIN     1
#define INSERT   2
#define LOOKUP   3
#define RECLAIM  4

typedef struct seqNode {
    nodeID originNode;
    int maxSeqNumber;
} list_seqNode;

typedef struct {
    list_seqNode *head;
} seqList;

typedef struct {
    int cmd;
    nodeID node;
    fileID file;
    char contents[P2P_FILE_MAXSIZE];
    int len;
} userMessage;

static int sequence;
static seqList *maxSeqList;
static int maxHop = 5;

void HandleMessage(int src, int dest, const void *msg, int len){
    if (seqList == NULL){
        maxSeqList = malloc(sizeof(seqList));
    }

    /* Receiving p2p user commands */
    if (src == GetPid() && dest == -1){
        userMessage *rMsg = (userMessage *)msg;
        if (rMsg->cmd == JOIN){
            
        }

    }
    else{

    }

}