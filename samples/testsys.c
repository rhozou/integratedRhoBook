#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

#include <rednet.h>

#define USER_MESSAGE     1
#define TAKE_TENTATIVE   2
#define TAKE_PERMANENT   3
#define WILLING_TO_TAKE  4

typedef struct process{
	int pid;
    int cohort;
    int willing;
    int last_rmsg;
    int first_smsg;
    unsigned int userLabel;
	struct process *next;
} queue_process;

typedef struct {
	queue_process *head;
} queue;

typedef struct mnode{
    int len;
    int dest;
	char msg[MSG_USR_MAXLEN];
    struct mnode *next;
} list_mnode;

typedef struct {
	list_mnode *head;
} list;

typedef struct {
    int cmd;
    int len;
    int lastRMsg;
    unsigned int usrLabel;
    char usrMsg[MSG_USR_MAXLEN];
} message;


static queue *pqueue;
static list *mlist;
/* flag to check whether this process should be initator, 1 is initator 2 is not */
static int initiator;

static int runCount;
static int checkPoint;
static int awaitProcess;

queue_process *findProcess(queue *q, int pid){
    queue_process *current_process = q->head;
    if (current_process == NULL){
        q->head = (queue_process *)malloc(sizeof(queue_process));
        q->head->pid = pid;
        q->head->cohort = 0;
        q->head->willing = 0;
        q->head->first_smsg = 0;
        q->head->last_rmsg = 0;
        q->head->userLabel = 0;
        q->head->next = NULL;
        return q->head;
    }
    else{
        while (current_process->next != NULL){
            if (current_process->pid == pid){
                return current_process;
            }
            current_process = current_process->next;
        }

        if (current_process->pid == pid){
                return current_process;
        }
        else{
            current_process->next = (queue_process *)malloc(sizeof(queue_process));
            current_process->next->pid = pid;
            current_process->next->cohort = 0;
            current_process->next->willing = 0;
            current_process->next->first_smsg = 0;
            current_process->next->last_rmsg = 0;
            current_process->next->userLabel = 0;
            current_process->next->next = NULL;
            return current_process->next;
        }
    }
}

void addMessage(int dest, const void *msg, int len){
    TracePrintf(3, "%d: trying to add message\n", GetPid());
    list_mnode *current_node = mlist->head;
    if (current_node == NULL){
        TracePrintf(3, "send to %d with message %d\n", dest, *(int *)msg);
        mlist->head = (list_mnode *)malloc(sizeof(list_mnode));
        mlist->head->len = len;
        mlist->head->dest = dest;
        memcpy(mlist->head->msg, msg, len);
        mlist->head->next = NULL;
        TracePrintf(3, "finish add message\n");
    }
    else{
        fprintf(stderr, "inside add message and head is NOT null\n");
        while (current_node->next != NULL){
            current_node = current_node->next;
        }
        current_node->next = (list_mnode *)malloc(sizeof(list_mnode));
        current_node->next->len = len;
        current_node->next->dest = dest;
        memcpy(current_node->next->msg, msg, len);
        current_node->next->next = NULL;
    }
}

void sendAllMessage(){
    TracePrintf(3, "%d: trying to send all message\n", GetPid());
    if (mlist->head == NULL){
        TracePrintf(3, "%d: no message exist\n", GetPid());
        return;
    }
    while (mlist->head != NULL){
        list_mnode *curnode = mlist->head;

        queue_process *pdata = findProcess(pqueue, curnode->dest);
        message *regMsg = malloc(sizeof(message));
        memcpy(regMsg->usrMsg, curnode->msg, curnode->len);
        pdata->userLabel = pdata->userLabel + 1;
        regMsg->usrLabel = pdata->userLabel;
        regMsg->cmd = USER_MESSAGE;
        regMsg->len = curnode->len;
        if (pdata->first_smsg == 0){
            pdata->first_smsg = pdata->userLabel;
        }
        TracePrintf(3, "send usr message to %d with command %d, message \n", curnode->dest, regMsg->cmd);
        TransmitMessage(GetPid(), curnode->dest, regMsg, MSG_SYS_MAXLEN);
        free(regMsg);
        mlist->head=curnode->next;
        free(curnode);
    }
    TracePrintf(3, "%d: trying to EXIT send all message\n", GetPid());
}


void sendAllTentative(){
    /* find all cohort process and send tentative checkpoints cmd */
    queue_process *cur_p = pqueue->head;
    int noCohort = 1;
    while (cur_p != NULL){
        if (cur_p->last_rmsg > 0 || cur_p->cohort == 1){
            cur_p->cohort = 1;
            message *sysMsg = malloc(sizeof(message));
            sysMsg->cmd = TAKE_TENTATIVE;
            sysMsg->lastRMsg = cur_p->last_rmsg;
            fprintf(stderr, "%d: send tentative to %d\n", GetPid(), cur_p->pid);
            TransmitMessage(GetPid(), cur_p->pid, sysMsg, MSG_SYS_MAXLEN);
            free(sysMsg);
            cur_p->last_rmsg = 0;
            cur_p->first_smsg = 0;
            noCohort = 0;
        }
        cur_p = cur_p->next;
    }
    
    /* in case there is no cohort process we just commit the checkpoint immediately */
    if (noCohort == 1){
        CommitCheckpoint(checkPoint);
        checkPoint = 0;
        TracePrintf(3, "permanent checkpoint %d\n", GetPid());
    }
}

void sendAllPermanent(){
    queue_process *cur_p = pqueue->head;
    while (cur_p != NULL){
        if (cur_p->cohort == 1){
            message *sysMsg = malloc(sizeof(message));
            sysMsg->cmd = TAKE_PERMANENT;
            fprintf(stderr, "%d: send permanent to %d\n", GetPid(), cur_p->pid);
            TransmitMessage(GetPid(), cur_p->pid, sysMsg, MSG_SYS_MAXLEN);
            free(sysMsg);
            cur_p->cohort = 0;
            cur_p->willing = 0;
        }
        cur_p = cur_p->next;
    }
}

int checkAllCohort(){
    int allYes = 1;
    queue_process *cur_p = pqueue->head;
    while (cur_p != NULL){
        if (cur_p->cohort == 1 && cur_p->willing == 0){
            allYes = 0;
            break;
        }
        cur_p = cur_p->next;
    }

    return allYes;
}

void HandleMessage(int src, int dest, const void *msg, int len){
    if (pqueue == NULL){
        pqueue = malloc(sizeof(queue));
    }
    if (mlist == NULL){
        mlist = malloc(sizeof(list));
    }

    if (src == 0 && dest == 0 && len == 0){
        if (initiator == 1 && runCount < 1){
            checkPoint = CreateCheckpoint();
            fprintf(stderr, "%d: initiate and sending all tentative\n", GetPid());
            sendAllTentative();
            runCount++;
        }
    }
    else{
        if (dest == GetPid()){
            
            if (initiator == 0){
                initiator = 2;
            }

            queue_process *pdata = findProcess(pqueue, src);
            message *receivedMessage = (message *)msg;
            TracePrintf(3, "%d: receiving message with command %d\n", GetPid(), receivedMessage->cmd);
            if (receivedMessage->cmd == USER_MESSAGE){
                pdata->last_rmsg = receivedMessage->usrLabel;
                TracePrintf(3, "%d: deliver message %d and length %d\n", GetPid(), *(int *)receivedMessage->usrMsg, receivedMessage->len);
                DeliverMessage(src, dest, receivedMessage->usrMsg, receivedMessage->len);
                return;
            }
            else{
                if (receivedMessage->cmd == TAKE_TENTATIVE){
                    int fsmsg = pdata->first_smsg;
                    if (receivedMessage->lastRMsg >= fsmsg && fsmsg > 0){
                        checkPoint = CreateCheckpoint();
                        awaitProcess = src;
                        fprintf(stderr, "%d: inside take tentative and inherit\n", GetPid());
                        sendAllTentative();
                    }
                    else{
                        message *sysMsg = malloc(sizeof(message));
                        sysMsg->cmd = WILLING_TO_TAKE;
                        fprintf(stderr, "%d: inside take tentative and send yes to %d\n", GetPid(), src);
                        TransmitMessage(GetPid(), src, sysMsg, MSG_SYS_MAXLEN);
                        free(sysMsg);
                    }
                }

                if (receivedMessage->cmd == WILLING_TO_TAKE){
                    queue_process *cur_p = pqueue->head;
                    while (cur_p != NULL){
                        if (cur_p->pid == src){
                            cur_p->willing = 1;
                            break;
                        }
                        cur_p = cur_p->next;
                    }
                    fprintf(stderr, "%d receive yes from %d\n", GetPid(), src);
                    /* now all the cohort reply to me yes */
                    if (checkAllCohort() == 1){
                        if (initiator == 1){
                            if (checkPoint > 0){
                                CommitCheckpoint(checkPoint);
                                fprintf(stderr, "permanent checkpoint %d\n", GetPid());
                                sendAllPermanent();
                                sendAllMessage();
                                checkPoint = 0;
                            }
                        }
                        else{
                            message *sysMsg = malloc(sizeof(message));
                            sysMsg->cmd = WILLING_TO_TAKE;
                            MilliSleep(1000);
                            fprintf(stderr, "%d: check all cohort send yes to %d\n", GetPid(), src);
                            TransmitMessage(GetPid(), awaitProcess, sysMsg, MSG_SYS_MAXLEN);
                            free(sysMsg);
                        }
                    }
                }

                if (receivedMessage->cmd == TAKE_PERMANENT){
                    if (checkPoint > 0){
                        CommitCheckpoint(checkPoint);
                        fprintf(stderr, "permanent checkpoint %d\n", GetPid());
                        sendAllPermanent();
                        sendAllMessage();
                        checkPoint = 0;
                    }
                }
                    
            }
            
        }
        else{
            /* transmit message to other machine */
            if (initiator == 0){
                initiator = 1;
            }

            if (checkPoint > 0){
                TracePrintf(3, "%d: add message %d with length %d to queue\n", GetPid(), *(int *)msg, len);
                addMessage(dest, msg, len);
                return;
            }
            else{
                queue_process *pdata = findProcess(pqueue, dest);
                message *regMsg = malloc(sizeof(message));
                memcpy(regMsg->usrMsg, msg, len);
                pdata->userLabel = pdata->userLabel + 1;
                regMsg->usrLabel = pdata->userLabel;
                regMsg->cmd = USER_MESSAGE;
                regMsg->len = len;
                if (pdata->first_smsg == 0){
                    pdata->first_smsg = pdata->userLabel;
                }
                TransmitMessage(src, dest, regMsg, MSG_SYS_MAXLEN);
                free(regMsg);
            }
            
        }
    }
}