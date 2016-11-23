/*
 *  External definitions for using the COMP 420 RedNet peer-to-peer
 *  system.  You should use
 *
 *     #include <rednet-p2p.h>
 *
 *  in each of your source files using the RedNet peer-to-peer system.
 */

#ifndef	_rednet_p2p_h
#define	_rednet_p2p_h

typedef unsigned short nodeID;	/* an unsigned 16-bit number */
typedef unsigned short fileID;	/* also an unsigned 16-bit number */

#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

int Join(nodeID);
int Insert(fileID, void *, int);
int Lookup(fileID, void *, int);
int Reclaim(fileID);

nodeID GetNodeID(void);

#ifdef __cplusplus
}
#endif /* __cplusplus */

/*
 *  The number of entries in a node's leaf set, listing the other
 *  nodes whose nodeID are numerically closest to this node's own
 *  nodeID.  Half of these entries should represent nodes whose nodeID
 *  are numerically *less than* this node's own nodeID, and half should
 *  represent nodes whose nodeID are numerically *greater than* this
 *  node's nodeID.
 */
#define	P2P_LEAF_SIZE		4	/* entries */

/*
 *  The maximum size (in bytes) of a file that may be stored in the
 *  RedNet peer-to-peer storage system.
 */
#define	P2P_FILE_MAXSIZE	1024	/* bytes */

#endif /*!_rednet_p2p_h*/