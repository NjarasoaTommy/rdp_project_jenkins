import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ErrorNotificationComponent } from '../error-notification/error-notification.component';

@Component({
  selector: 'app-tri-color-fire',
  imports: [CommonModule, NgxGraphModule, ErrorNotificationComponent],
  templateUrl: './tri-color-fire.component.html',
  styleUrl: './tri-color-fire.component.css',
})
export class TriColorFireComponent {
  error = '';
  showError = false;
  closeNotification() {
    this.showError = false;
  }
  franchir(type: string, id: string) {
    if (type != 'place') {
      const allPre = this.getAllPre(id);
      const allPost = this.getAllPost(id);
      let franchissable = true;
      allPre.forEach((val) => {
        if (!this.testFranchir(val[0], -1 * parseInt(val[1]))) {
          franchissable = false;
          return;
        }
      });
      allPost.forEach((val) => {
        if (!this.testFranchir(val[0], parseInt(val[1]))) {
          franchissable = false;
          return;
        }
      });

      if (franchissable) {
        allPre.forEach((val) =>
          this.updateJeton(val[0], -1 * parseInt(val[1]))
        );
        allPost.forEach((val) => this.updateJeton(val[0], parseInt(val[1])));
      } else {
        this.error = "Cette transition n'est pas franchissable";
        this.showError = true;
      }
    }
  }

  getAllPre(id: string) {
    let allPre: any[] = [];
    this.links.forEach((link) => {
      if (link.target == id) {
        const placeTransitionWithWeight = [];
        placeTransitionWithWeight.push(link.source);
        placeTransitionWithWeight.push(link.poids);
        allPre.push(placeTransitionWithWeight);
      }
    });
    return allPre;
  }

  getAllPost(id: string) {
    let allPost: any[] = [];
    this.links.forEach((link) => {
      if (link.source == id) {
        const transitionWithWeightPlace = [];
        transitionWithWeightPlace.push(link.target);
        transitionWithWeightPlace.push(link.poids);
        allPost.push(transitionWithWeightPlace);
      }
    });
    return allPost;
  }

  updateJeton(id: string, val: number) {
    const node = this.nodes.find((node) => node.id == id);
    if (node && (node.jetons || node.jetons == 0)) {
      node.jetons += val;
    }
  }

  testFranchir(id: string, val: number) {
    const node = this.nodes.find((node) => node.id == id);
    if (
      node &&
      (node.jetons || node.jetons == 0) &&
      node.jetons + val >= 0 &&
      node.jetons + val <= node.capacity
    ) {
      return true;
    }
    return false;
  }

  nodes = [
    {
      id: 'p1',
      label: 'P1',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'rouge',
    },
    {
      id: 'p2',
      label: 'P2',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'vert',
    },
    {
      id: 'p3',
      label: 'P3',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'orange',
    },
    {
      id: 'p4',
      label: 'P4',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'rouge',
    },
    {
      id: 'p5',
      label: 'P5',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'vert',
    },
    {
      id: 'p6',
      label: 'P6',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'orange',
    },
    {
      id: 'p7',
      label: 'P7',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: '',
    },
    { id: 't1', label: 'T1', type: 'transition_verticale', couleur: '' },
    { id: 't2', label: 'T2', type: 'transition_verticale', couleur: '' },
    { id: 't3', label: 'T3', type: 'transition_verticale', couleur: '' },
    { id: 't4', label: 'T4', type: 'transition_verticale', couleur: '' },
    { id: 't5', label: 'T5', type: 'transition_verticale', couleur: '' },
    { id: 't6', label: 'T6', type: 'transition_verticale', couleur: '' },
  ];

  links = [
    { source: 'p1', target: 't1', poids: '1' }, //R1 -> V1
    { source: 'p7', target: 't1', poids: '1' }, //pontrol -> V1
    { source: 't1', target: 'p2', poids: '1' }, //---> V1
    { source: 'p2', target: 't2', poids: '1' }, //V1 -> O1
    { source: 't2', target: 'p3', poids: '1' }, //---> O1
    { source: 'p3', target: 't3', poids: '1' }, //O1 -> R1|Control
    { source: 't3', target: 'p1', poids: '1' }, //--->R1
    { source: 't3', target: 'p7', poids: '1' }, //--->Control

    { source: 'p4', target: 't4', poids: '1' }, //R2 -> V2
    { source: 'p7', target: 't4', poids: '1' }, //Control -> V2
    { source: 't4', target: 'p5', poids: '1' }, //---> V2
    { source: 'p5', target: 't5', poids: '1' }, //V2 -> O2
    { source: 't5', target: 'p6', poids: '1' }, //---> O2
    { source: 'p6', target: 't6', poids: '1' }, //O2 -> R2|Control
    { source: 't6', target: 'p4', poids: '1' }, //---> R2
    { source: 't6', target: 'p7', poids: '1' }, //---> Control
  ];

  placeMapping = [
    {
      id: 'p1',
      place: 'Rouge1',
    },
    {
      id: 'p2',
      place: 'Vert1',
    },
    {
      id: 'p3',
      place: 'Orange1',
    },
    {
      id: 'p4',
      place: 'Rouge2',
    },
    {
      id: 'p5',
      place: 'Vert2',
    },
    {
      id: 'p6',
      place: 'Orange2',
    },
    {
      id: 'p7',
      place: 'Control',
    },
  ];

  transitionMapping = [
    {
      id: 't1',
      liaison: 'Rouge1 -> Vert1',
    },
    {
      id: 't1',
      liaison: 'Control -> Vert1',
    },
    {
      id: 't2',
      liaison: 'Vert1 -> Orange1',
    },
    {
      id: 't3',
      liaison: 'Orange1 -> Rouge1',
    },
    {
      id: 't3',
      liaison: 'Orange1 -> Control',
    },
    {
      id: 't4',
      liaison: 'Rouge2 -> Vert2',
    },
    {
      id: 't4',
      liaison: 'Control -> Vert2',
    },
    {
      id: 't5',
      liaison: 'Vert2 -> Orange2',
    },
    {
      id: 't6',
      liaison: 'Orange2 -> Rouge2',
    },
    {
      id: 't6',
      liaison: 'Orange2 -> Control',
    },
  ];
}
