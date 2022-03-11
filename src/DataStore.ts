//use to Store the data and gives access to all components
class Store {
  public static BOARD = [];
  public static PLAYERS = [];
  public static LINES = 0;
  public static ROOM_ID = "";
  public static NAME = "";
  public static CREATOR = false;
  public static IS_STARTED = false;
  public static IS_CURRENT_PLAYER = false;
  public static MESSAGES = [];
  public static TICKED = [];
  private static lines = [
    //Horizontal lines
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    //vertical Lines
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    //cross lines
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];

  public static update = () => {
    for (var i of Store.lines) {
      if (
        Store.TICKED[i[0]] &&
        Store.TICKED[i[1]] &&
        Store.TICKED[i[2]] &&
        Store.TICKED[i[3]] &&
        Store.TICKED[i[4]]
      ) {
        Store.LINES = Store.LINES + 1;
        var x = Store.lines.indexOf(i);
        Store.lines.splice(x, 1);
      }
    }
  };
  public static clear() {
    Store.BOARD = [];
    Store.PLAYERS = [];
    Store.LINES = 0;
    Store.ROOM_ID = "";
    Store.NAME = "";
    Store.CREATOR = false;
    Store.IS_STARTED = false;
    Store.IS_CURRENT_PLAYER = false;
    Store.MESSAGES = [];
    Store.TICKED = [];
  }
}

export default Store;
