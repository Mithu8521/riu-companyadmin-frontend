export const reducer = (state, action) => {
  switch (action.type) {
    case "Add_Menu":
      return {
        ...state,
        menus: action.payload,
      };
    case "Add_Role":
      return {
        ...state,
        role: action.payload,
      };
    default:
      return state;
  }
};
