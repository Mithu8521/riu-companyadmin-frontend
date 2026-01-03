import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { apiCall } from "../../_services/apiCall";
import config from "../../config/config.json";
import SearchableSelect from "../../component/CarbonFootPrinting/utils/SearchableSelect"; 
import swal from "sweetalert";
import { nanoid } from "nanoid";


// Styled components for the org chart nodes
const StyledNode = styled.div`
  padding: 12px;
  border-radius: 8px;
  display: inline-block;
  border: 2px solid #4a90e2;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  text-align: center;
  position: relative;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    border-color: #357abd;
  }
`;

const NodeName = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  color: #333;
`;

const NodeRole = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
`;

const NodeActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  font-size: 11px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &.add {
    color: #28a745;
    border-color: #28a745;
    &:hover {
      background-color: #28a745;
      color: white;
    }
  }

  &.remove {
    color: #dc3545;
    border-color: #dc3545;
    &:hover {
      background-color: #dc3545;
      color: white;
    }
  }

  &.edit {
    color: #007bff;
    border-color: #007bff;
    &:hover {
      background-color: #007bff;
      color: white;
    }
  }
`;

const FlowCharts = (props) => {
  const { userPermissionList } = props;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const userId = currentUser?.id;
  const [orgChartData, setOrgChartData] = useState({
    id: nanoid(),
    name: "",
    actor: "",
    userId: null,
    parentUserId: null,
    audit: "",
    children: [],
  });

  // Modal states - UNIFIED: One modal for all operations
  const [unifiedModal, setUnifiedModal] = useState(false);
  const [modalMode, setModalMode] = useState(''); // 'addChild', 'addSibling', 'edit'
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [subUserId, setSubUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);

  const getOrgChart = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getOrgChart`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      setOrgChartData(data?.data?.orgChart);
    }
  };

  useEffect(() => {
    getOrgChart();
  }, []);

  const roleManagementList = async () => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getMasterData`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const roleIdArray = await findRoleIds(orgChartData);
      const filteredArray = data?.data?.filter(
        (obj) => !roleIdArray.includes(obj.id)
      );
      setRoleList(data?.data?.reverse());
    }
  };

  const findRoleIds = async (obj, result = []) => {
    if (obj.roleId !== null && obj.roleId !== undefined) {
      result.push(obj.roleId);
    }
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((child) => findRoleIds(child, result));
    }
    return result;
  };

  const findUserIds = async (obj, result = []) => {
    if (obj.userId !== null && obj.userId !== undefined) {
      result.push(obj.userId);
    }
    if (obj.children && obj.children.length > 0) {
      obj.children.forEach((child) => findUserIds(child, result));
    }
    return result;
  };

  const getSubUser = async (roleId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getSubUserBasedOnRoleId`,
      {},
      {},
      "GET"
    );
    if (isSuccess) {
      const userIdArray = await findUserIds(orgChartData);
      const filteredArray = data?.data?.filter(
        (obj) => !userIdArray.includes(obj.userId)
      );
      setUserList(data?.data);
    }
  };

  const updateNode = (nodeId, actor) => {
    setOrgChartData((prevData) => {
      // Helper to recursively clone and update
      const updateNodeRecursively = (node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            name: actor.name,
            userId: actor.userId,
            role: actor.role,
            roleId: actor.roleId,
          };
        }

        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: node.children.map(updateNodeRecursively),
          };
        }

        return node;
      };

      const newDataVariable = updateNodeRecursively(prevData);
      saveChart(newDataVariable, null, null, null);
      return newDataVariable;
    });
  };


  const handleAddChild = (currentNode, actor, audit) => {
    setOrgChartData((prevData) => {
      const updatedData = { ...prevData };

      const newChild = {
        id: nanoid(),
        name: actor?.name || "External User",
        actor: actor?.actor || "",
        role: actor?.role || "",
        roleId: actor?.roleId || null,
        userId: actor?.userId || null,
        parentNodeId: currentNode.id,
        audit: "",
        children: [],
      };

      if (!currentNode.children) {
        currentNode.children = [];
      }

      currentNode.children.push(newChild);

      const newDataVariable = { ...updatedData };
      saveChart(newDataVariable, actor?.userId, currentNode.userId, audit);

      return updatedData;
    });
  };

  const handleAddChildSameLevel = (currentNode, actor, audit) => {
    setOrgChartData((prevData) => {
      const updatedData = { ...prevData };
      const {parentNode} = findParentById(updatedData, currentNode.id);

      const newChild = {
        id: nanoid(),
        name: actor?.name || "External User",
        actor: actor?.actor || "",
        role: actor?.role || "",
        roleId: actor?.roleId || null,
        userId: actor?.userId || null,
        parentNodeId: parentNode.id,
        audit: "",
        children: [],
      };

      if (!parentNode.children) {
        parentNode.children = [];
      }

      parentNode.children.push(newChild);

      const newDataVariable = { ...updatedData };
      saveChart(newDataVariable, actor?.userId, parentNode.userId, audit);

      return updatedData;
    });
  };

  const getAssignedQuestion = async (userId) => {
    const { isSuccess, data } = await apiCall(
      `${config.POSTLOGIN_API_URL_COMPANY}getAssignedQuestion`,
      {},
      { userId: userId },
      "GET"
    );
    if (isSuccess) {
      return data.data;
    }
  };

  const handleRemoveNode = async (event, nodeId) => {
    // CRITICAL: Stop all event propagation to prevent logout
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const { parentNode, foundNode } = findParentById(orgChartData, nodeId);
    
    if (!foundNode) {
      console.error("Node not found:", nodeId);
      return;
    }

    try {
      let assignedDetails;
      if (foundNode?.userId) {
        assignedDetails = await getAssignedQuestion(foundNode?.userId);
      }

      if (assignedDetails && assignedDetails.length > 0) {
        swal({
          icon: "warning",
          title: "Warning",
          text: `You cannot remove this user as there are assigned questions: ${assignedDetails}`,
        });
      } else {
        swal({
          title: "Are you sure?",
          text: "Do you want to remove this node?",
          icon: "warning",
          buttons: ["Cancel", "Remove"],
          dangerMode: true,
        }).then((willDelete) => {
          if (willDelete) {
            setOrgChartData((prevData) => {
              const updatedData = { ...prevData };
              const { parentNode: parent,  foundNode: removedNode} = findParentById(updatedData, nodeId);

              if (parent && parent.children) {
                if (removedNode.children && removedNode.children.length > 0) {
                  parent.children = parent.children.flatMap((child) => {
                    if (child.id === nodeId) {
                      return removedNode.children;
                    }
                    return [child];
                  });
                } else {
                  parent.children = parent.children.filter((child) => child.id !== nodeId);
                }
                
                const newDataVariable = { ...updatedData };
                saveChart(newDataVariable, null, null, null);
                return newDataVariable;
              }
              return prevData;
            });
          }
        });
      }
    } catch (error) {
      console.error("Error removing node:", error);
      swal({
        icon: "error",
        title: "Error",
        text: "An error occurred while removing the node. Please try again.",
      });
    }
  };

  const findParentById = (node, targetId, parent = null) => {
    if (node.id === targetId) {
      return { parentNode: parent, foundNode: node };
    }

    if (node.children) {
      for (const child of node.children) {
        const result = findParentById(child, targetId, node);
        if (result.foundNode) {
          return result;
        }
      }
    }

    return { parentNode: null, foundNode: null };
  };

  const findNodeById = (node, targetId) => {
    console.log('node', node.id, 'target', targetId);
    if (node.id === targetId) {
      return node;
    }

    if (node.children) {
      for (const child of node.children) {
        const foundNode = findNodeById(child, targetId);
        if (foundNode) {
          return foundNode;
        }
      }
    }

    return null;
  };

  const openUnifiedModal = (node, mode) => {
    setSelectedNode(node);
    setModalMode(mode);
    
    // For edit mode, pre-populate with current values
    if (mode === 'edit') {
      setSubUserId(node?.userId ?? null);
      setRoleId(node?.roleId ?? null);
    }
    
    // Load data
    getSubUser();
    roleManagementList();
    setUnifiedModal(true);
  };

  const closeUnifiedModal = () => {
    setUnifiedModal(false);
    setModalMode('');
    setSelectedNode(null);
    setSubUserId("");
    setRoleId("");
  };

  const saveChart = async (orgChartData, userId, parentUserId, audit) => {
    const { isSuccess, data, error } = await apiCall(
      config.POSTLOGIN_API_URL_COMPANY + `createOrgChart`,
      {},
      {
        orgChart: JSON.stringify(orgChartData),
        validateAudit: audit,
        parentUserId: parentUserId,
        userId: userId,
      },
      "POST"
    );
    if (isSuccess) {
      // Handle success
    }
  };

  // Recursive function to render tree nodes
  const renderTreeNodes = (node) => {
    if (!node) return null;

    // Permission check helper for object-based permissions
    const hasPermission = (permissionCode) => {
      if (!userPermissionList || !Array.isArray(userPermissionList)) return false;
      return userPermissionList.some(
        perm => perm.permissionCode === permissionCode && perm.checked === true
      );
    };

    const canCreate = hasPermission("CREATE_CHART");
    const canReassign = hasPermission("REASSIGN_USER");
    const canRemove = hasPermission("REMOVE_USER");

    return (
      <TreeNode
        label={
          <StyledNode>
            <NodeName>{node.name || "Unnamed"}</NodeName>
            {node.role && <NodeRole>{node.role}</NodeRole>}
            <NodeActions>
              {canCreate && (
                <>
                  <ActionButton
                    className="add"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUnifiedModal(node, 'addChild');
                    }}
                    title="Add Child"
                  >
                    + Child
                  </ActionButton>
                  <ActionButton
                    className="add"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUnifiedModal(node, 'addSibling');
                    }}
                    title="Add Sibling"
                  >
                    + Sibling
                  </ActionButton>
                </>
              )}
              {canReassign && node.roleId != 1 && (
                <ActionButton
                  className="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    openUnifiedModal(node, 'edit');
                  }}
                  title="Edit User/Role"
                >
                  Edit
                </ActionButton>
              )}
              {canRemove && node.roleId != 1 && (
                <ActionButton
                  className="remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNode(e, node.id);
                  }}
                  title="Remove"
                >
                  Remove
                </ActionButton>
              )}
            </NodeActions>
          </StyledNode>
        }
      >
        {node.children &&
          node.children.length > 0 &&
          node.children.map((child) => (
            <React.Fragment key={child.id}>
              {renderTreeNodes(child)}
            </React.Fragment>
          ))}
      </TreeNode>
    );
  };

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
        minHeight: "81vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Tree
          lineWidth="2px"
          lineColor="#bbb"
          lineBorderRadius="10px"
          label={
            <StyledNode>
              <NodeName>{orgChartData.name || "Organization"}</NodeName>
              {orgChartData.role && <NodeRole>{orgChartData.role}</NodeRole>}
              <NodeActions>
                {userPermissionList?.some(p => p.permissionCode === "CREATE_CHART" && p.checked) && orgChartData.roleId == 1 && (
                  <ActionButton
                    className="add"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUnifiedModal(orgChartData, 'addChild');
                    }}
                    title="Add Child"
                  >
                    + Child
                  </ActionButton>
                )}
                {/* {userPermissionList?.some(p => p.permissionCode === "REASSIGN_USER" && p.checked) && (
                  <ActionButton
                    className="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUnifiedModal(orgChartData, 'edit');
                    }}
                    title="Edit User"
                  >
                    Edit
                  </ActionButton>
                )} */}
              </NodeActions>
            </StyledNode>
          }
        >
          {orgChartData.children &&
            orgChartData.children.length > 0 &&
            orgChartData.children.map((child) => (
              <React.Fragment key={child.id}>
                {renderTreeNodes(child)}
              </React.Fragment>
            ))}
        </Tree>
      </div>

      <Modal show={unifiedModal} onHide={closeUnifiedModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'addChild' && 'Add Child'}
            {modalMode === 'addSibling' && 'Add Sibling'}  
            {modalMode === 'edit' && 'Edit User / Role'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="form-group pb-3">
              <SearchableSelect
                field={{
                  name: "select_user",
                  label: "Select User",
                  required: false,
                  colorIndicator: "#3b82f6",
                }}
                value={subUserId ? String(subUserId) : ""}
                options={[
                  ...(userList?.map((user) => ({
                    value: String(user.userId),
                    label: `${user.firstName} ${user.lastName}`,
                  })) || []),
                ]}
                isDisabled={false}
                updateFormData={(fieldName, selectedValue) => setSubUserId(selectedValue)}
                formFields={[]}
                commonStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                  cursor: "pointer",
                }}
              />
            </div>

            <div className="form-group pb-3">
              <SearchableSelect
                field={{
                  name: "select_role",
                  label: "Select Role",
                  required: false,
                  colorIndicator: "#10b981", // green tone
                }}
                value={roleId ? String(roleId) : ""}
                options={[
                  ...(roleList?.map((role) => ({
                    value: String(role.id),
                    label: role.role_name,
                  })) || []),
                ]}
                isDisabled={false}
                updateFormData={(fieldName, selectedValue) => setRoleId(selectedValue)}
                formFields={[]}
                commonStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  height: "44px",
                  cursor: "pointer",
                }}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={closeUnifiedModal}>
            Cancel
          </Button>
          <Button 
            variant="info" 
            onClick={() => {
              if (modalMode === 'edit') {
                // Edit mode
                if (selectedNode) {

                const currentUser = userList.find(user => user.userId == subUserId);
                const currentRole = roleList.find(role => role.id == roleId);
                  const actor = {
                    ...selectedNode, 
                    name: currentUser ? currentUser.firstName + " " + currentUser.lastName : "External User",
                    userId: currentUser?.userId ?? null,
                    role: currentRole?.role_name ?? "",
                    roleId: currentRole?.id ?? null
                  };

                  updateNode(selectedNode.id, actor);
                  closeUnifiedModal();
                }
              } else if (modalMode === 'addChild') {
                const currentUser = userList.find(user => user.userId == subUserId);
                const currentRole = roleList.find(role => role.id == roleId);
                const actor = {
                  name: currentUser ? currentUser.firstName + " " + currentUser.lastName : "External User",
                  userId: currentUser?.userId ?? null,
                  role: currentRole?.role_name ?? "",
                  roleId: currentRole?.id ?? null
                }
                handleAddChild(selectedNode, actor);
                closeUnifiedModal();
              } else if (modalMode === 'addSibling') {
                const currentUser = userList.find(user => user.userId == subUserId);
                const currentRole = roleList.find(role => role.id == roleId);
                const actor = {
                  name: currentUser ? currentUser.firstName + " " + currentUser.lastName : "External User",
                  userId: currentUser?.userId ?? null,
                  role: currentRole?.role_name ?? "",
                  roleId: currentRole?.id ?? null
                }
                handleAddChildSameLevel(selectedNode, actor);
                closeUnifiedModal();
              }
            }}
          >
            {modalMode === 'edit' ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FlowCharts;