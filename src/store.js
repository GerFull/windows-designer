import * as mobx from "mobx";

const DEVIDER_SIZE = 40;

function id() {
  return Math.round(Math.random() * 10000);
}

class Section {
  nodeType = "section";
  constructor(attrs) {
    mobx.extendObservable(this, {
      id: id(),
      width: attrs.width,
      height: attrs.height,
      frameSize: attrs.frameSize || 0,
      type: attrs.type || "none",
      splitDirection: null,
      sections: []
    });
  }
}

class Devider {
  nodeType = "devider";
  constructor(attrs) {
    mobx.extendObservable(this, {
      id: id(),
      width: attrs.width,
      height: attrs.height,
      sections: []
    });
  }
}

class Store {
  constructor() {
    mobx.extendObservable(this, {
      selectedSectionId: null,
      x:0,
      y:0,
      root: {
        id: "root",
        width: 800,
        height: 1000,
        frameSize: 0,
        splitDirection: null,
        sections: []
      },
      get selectedSection() {
        function findNested(sec, id) {
          if (sec.id === id) {
            return sec;
          }
          if (!sec.sections) {
            return null;
          }
          for (var i = 0; i < sec.sections.length; i++) {
            var founded = findNested(sec.sections[i], id);
            if (founded) {
              return founded;
            }
          }
        }
        return findNested(this.root, this.selectedSectionId);
      }
    });
  }

  setSectionType(type) {
    this.selectedSection.type = type;
    if (type === "none") {
      this.selectedSection.frameSize = 0;
    } else {
      this.selectedSection.frameSize = this.selectedSection.frameSize || 50;
    }
  }

  mousePosition(x,y){
    this.x=x
    this.y=y
  }


  splitCurrentSection(direction) {
    const { selectedSection } = this;
    selectedSection.splitDirection = direction;

    console.log(selectedSection)

    if (direction === "vertical") {
      selectedSection.sections.push(
        new Section({
          width: selectedSection.width / 2 - DEVIDER_SIZE / 2,
          height: selectedSection.height
        }),
        new Devider({
          width: DEVIDER_SIZE,
          height: selectedSection.height
        }),
        new Section({
          width: selectedSection.width / 2 - DEVIDER_SIZE / 2,
          height: selectedSection.height
        })
      );
    } else {
      selectedSection.sections.push(
        new Section({
          width: selectedSection.width,
          height: selectedSection.height / 2 - DEVIDER_SIZE / 2
        }),
        new Devider({
          width: selectedSection.width,
          height: DEVIDER_SIZE
        }),
        new Section({
          width: selectedSection.width,
          height: selectedSection.height / 2 - DEVIDER_SIZE / 2
        })
      );
    }
    this.selectedSectionId = null;
  }
}

export default () => new Store();
