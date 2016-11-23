/*
 *  External definitions for using the COMP 420 RedNet distributed
 *  system programming environment.  You should use
 *
 *     #include <rednet.h>
 *
 *  in each of your source files using the RedNet environment.
 */

#ifndef	_rednet_h
#define	_rednet_h

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

/*
 *  Supplied proceures that may be called from user-level programs
 *  and/or from the operating system kernel code.
 */
extern int TransmitMessage(int, int, const void *, int);
extern int DeliverMessage(int, int, const void *, int);
extern int SendMessage(int, const void *, int);
extern int ReceiveMessage(int *, void *, int);
extern int CreateProcess(const char *, const char **);
extern int GetPid(void);
extern int GetPPid(void);

extern void TracePrintf(int, char *, ...);

/*
 *  Definition of the HandleMessage procedure arguments and return
 *  value types.  YOU must write YOUR OWN HandleMessage procedure.
 *  This procedure is NOT supplied to you, as it will be different
 *  in everyone's kernel.
 */
extern void HandleMessage(int, int, const void *, int);

#ifdef __cplusplus
}
#endif /* __cplusplus */

/*
 *  The maximum size of messages:
 *
 *   - MSG_USR_MAXLEN is the maximum size of a user message, passed
 *     to SendMessage or returned from ReceiveMessage.
 *   - MSG_SYS_MAXLEN is the maximum size of a system (kernel) message,
 *     passed to TransmitMessage or returned from DeliverMessage.
 *
 *  The value of MSG_SYS_MAXLEN is greater than the value of
 *  MSG_USR_MAXLEN to ensure that your kernel's HandleMessage procedure
 *  has room to carry any possible user-level message as the payload
 *  in a system (kernel) message, while still also having room in the
 *  system message to add a kernel-level header of your own design
 *  to the system message.
 *
 *  In a real system, the difference between MSG_USR_MAXLEN and
 *  MSG_SYS_MAXLEN would be less than it is here, but for this class,
 *  by having MSG_SYS_MAXLEN be this much larger than MSG_USR_MAXLEN,
 *  you do not need to worry as much about how to compactly encode
 *  any extra system "stuff" you might need to include in any message.
 */
#define	MSG_USR_MAXLEN		4096
#define	MSG_SYS_MAXLEN		8192

#define	ERROR_LEN_TOO_LARGE	(-1)
#define	ERROR_LEN_TOO_SMALL	(-2)
#define	ERROR_PROCESS_NOT_FOUND	(-3)

#endif /*!_rednet_h*/
