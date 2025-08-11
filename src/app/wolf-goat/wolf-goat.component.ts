import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule, GraphComponent } from '@swimlane/ngx-graph';
import { ErrorNotificationComponent } from '../error-notification/error-notification.component';

@Component({
  selector: 'app-wolf-goat',
  imports: [CommonModule, NgxGraphModule, ErrorNotificationComponent],
  templateUrl: './wolf-goat.component.html',
  styleUrl: './wolf-goat.component.css',
})
export class WolfGoatComponent implements AfterViewInit {
  error = '';
  errorList: string[] = [];
  franchissable: boolean = false;
  showError = false;

  @ViewChild(GraphComponent) graph?: GraphComponent;

  renderGraph() {
    setTimeout(() => this.graph?.update(), 0);
  }

  constructor(private elRef: ElementRef) {}

  emptyError() {
    this.error = '';
    this.errorList = [];
  }

  checkError() {
    const host = this.elRef.nativeElement;
    const allPlaceWithError = Array.from(
      host.querySelectorAll('div.error')
    ) as HTMLElement[];
    for (let item of allPlaceWithError) {
      const prevLabel = item.previousElementSibling;
      if (prevLabel) {
        prevLabel.classList.add('error');
      }
    }
  }
  removeError() {
    const host = this.elRef.nativeElement;
    const allLabelWithError = Array.from(
      host.querySelectorAll('strong.error')
    ) as HTMLElement[];
    for (let item of allLabelWithError) {
      item.classList.remove('error');
    }
  }

  ngAfterViewInit(): void {
    this.checkError();
  }

  closeNotification() {
    this.showError = false;
    this.clearError();
    this.emptyError();
  }
  getInputOutPut(inputs: any[], outputs: any[]) {
    const inputOuput: any[] = [];
    inputs.forEach((input) => {
      outputs.forEach((output) => {
        if (input[0] == output[0]) {
          const nodePrePost = [
            input[0],
            input[2],
            output[2],
            input[1],
            output[1],
          ];
          inputOuput.push(nodePrePost);
        }
      });
    });
    return inputOuput;
  }
  franchir(type: string, id: string) {
    if (type != 'place') {
      const allPre = this.getAllPre(id);
      const allPost = this.getAllPost(id);
      const inputOuput = this.getInputOutPut(allPre, allPost);
      this.franchissable = true;
      allPre.forEach((val: any[]) => {
        let valOk = true;
        inputOuput.forEach((io) => {
          if (io[0] == val[0]) valOk = false;
        });
        if (valOk) {
          const err = this.testFranchir(
            val[0],
            -1 * parseInt(val[2]),
            'entrée'
          );
          if (err != '') {
            this.franchissable = false;
            this.errorList.push(err);
            this.indicateError(val[0], 'place');
            this.indicateError(val[1], 'arc');
          }
        }
      });
      allPost.forEach((val: any[]) => {
        let valOk = true;
        inputOuput.forEach((io) => {
          if (io[0] == val[0]) valOk = false;
        });
        if (valOk) {
          const err = this.testFranchir(val[0], parseInt(val[2]), 'sortie');
          if (err != '') {
            this.franchissable = false;
            this.errorList.push(err);
            this.indicateError(val[0], 'place');
            this.indicateError(val[1], 'arc');
          }
        }
      });
      inputOuput.forEach((val: any[]) => {
        const err = this.testInputOutput(val);
        if (err != '') {
          this.franchissable = false;
          this.errorList.push(err);
          this.indicateError(val[0], 'place');
          this.indicateError(val[3], 'arc');
          this.indicateError(val[4], 'arc');
        }
      });

      if (this.franchissable) {
        allPre.forEach((val) =>
          this.updateJeton(val[0], -1 * parseInt(val[2]))
        );
        allPost.forEach((val) => this.updateJeton(val[0], parseInt(val[2])));
      } else {
        this.error = "Cette transition n'est pas franchissable.";
        for (let err of this.errorList) {
          this.error += err;
        }
        this.showError = true;
        this.indicateError(id, 'transition');
      }
    }
  }

  getAllPre(id: string) {
    let allPre: any[] = [];
    this.links.forEach((link) => {
      if (link.target == id) {
        const placeTransitionWithWeight = [];
        placeTransitionWithWeight.push(link.source);
        placeTransitionWithWeight.push(link.id);
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
        transitionWithWeightPlace.push(link.id);
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
  testInputOutput(val: any[]): string {
    const node = this.nodes.find((node) => node.id == val[0]);
    const jet: number = node && node.jetons ? node.jetons : 0;
    if (
      node &&
      node.capacity &&
      jet - parseInt(val[1] + parseInt(val[2])) > node.capacity
    ) {
      return (
        'La capacité maximale(' +
        node.capacity +
        ') de la place(' +
        val[0] +
        ') sera dépassée car la place(' +
        val[0] +
        ') a ' +
        node.jetons +
        ' jeton(s) et on enlève ' +
        val[1] +
        ' jeton(s) puis on rajoute ' +
        val[2] +
        ' jeton(s). Ce qui donne ' +
        (node.jetons - val[1] + val[2]) +
        ' jeton(s)(>' +
        node.capacity +
        ')'
      );
    }
    return '';
  }
  testFranchir(id: string, val: number, type: string): string {
    const node = this.nodes.find((node) => node.id == id);
    if (node && node.jetons == 0 && type == 'entrée') {
      return 'La place de départ(' + node.label + ") n'a pas de jeton.";
    } else if (
      node &&
      node.jetons &&
      node.jetons != 0 &&
      node.jetons + val < 0 &&
      type == 'entrée'
    ) {
      return (
        'La place de départ(' +
        node.label +
        ") n'a pas suffisament de jeton: Jeton : " +
        node.jetons +
        ' < capacité arc : ' +
        (val < 0 ? -1 * val : val) +
        '.'
      );
    } else if (
      node &&
      node.jetons &&
      node.jetons + val > node.capacity &&
      type == 'sortie'
    ) {
      return (
        'La capacité maximale(' +
        node.capacity +
        ") de la place d'arrivé(" +
        node.label +
        ') sera dépassé' +
        " car la valeur de l'arc est " +
        (val < 0 ? -1 * val : val) +
        " et le nombre de jeton de place d'arrivé(" +
        node.label +
        ') est ' +
        node.jetons +
        '.'
      );
    }
    return '';
  }

  nodes = [
    {
      id: 'p1',
      label: 'P1',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'bleu',
      isError: false,
    },
    {
      id: 'p2',
      label: 'P2',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'vert',
      isError: false,
    },
    {
      id: 'p3',
      label: 'P3',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'rose',
      isError: false,
    },
    {
      id: 'p4',
      label: 'P4',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'orange',
    },
    {
      id: 'p5',
      label: 'P5',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'bleu',
      isError: false,
    },
    {
      id: 'p6',
      label: 'P6',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'vert',
      isError: false,
    },
    {
      id: 'p7',
      label: 'P7',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'rose',
      isError: false,
    },
    {
      id: 'p8',
      label: 'P8',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'orange',
      isError: false,
    },
    {
      id: 't1',
      label: 'T1',
      type: 'transition_verticale',
      couleur: 'bleu',
      isError: false,
    },
    {
      id: 't2',
      label: 'T2',
      type: 'transition_verticale',
      couleur: 'vert',
      isError: false,
    },
    {
      id: 't3',
      label: 'T3',
      type: 'transition_verticale',
      couleur: 'rose',
      isError: false,
    },
    {
      id: 't4',
      label: 'T4',
      type: 'transition_verticale',
      couleur: 'orange',
      isError: false,
    },
    {
      id: 't5',
      label: 'T5',
      type: 'transition_verticale',
      couleur: 'bleu',
      isError: false,
    },
    {
      id: 't6',
      label: 'T6',
      type: 'transition_verticale',
      couleur: 'vert',
      isError: false,
    },
    {
      id: 't7',
      label: 'T7',
      type: 'transition_verticale',
      couleur: 'rose',
      isError: false,
    },
    {
      id: 't8',
      label: 'T8',
      type: 'transition_verticale',
      couleur: 'orange',
      isError: false,
    },
    {
      id: 't9',
      label: 'T9',
      type: 'transition_verticale',
      couleur: 'gris',
      isError: false,
    },
    {
      id: 't10',
      label: 'T10',
      type: 'transition_verticale',
      couleur: 'gris',
      isError: false,
    },
    {
      id: 't11',
      label: 'T11',
      type: 'transition_verticale',
      couleur: 'gris',
      isError: false,
    },
    {
      id: 't12',
      label: 'T12',
      type: 'transition_verticale',
      couleur: 'gris',
      isError: false,
    },
  ];

  links = [
    { id: 'pt11', source: 'p1', target: 't1', poids: '1', isError: false }, //CHOU -> CHOU++
    { id: 'pt41', source: 'p4', target: 't1', poids: '1', isError: false }, //HOMME -> HOMME++
    { id: 'tp15', source: 't1', target: 'p5', poids: '1', isError: false }, //---- CHOU -> CHOU++
    { id: 'tp18', source: 't1', target: 'p8', poids: '1', isError: false }, //---- HOMME -> HOMME++

    { id: 'pt22', source: 'p2', target: 't2', poids: '1', isError: false }, //CHEVRE -> CHEVRE++
    { id: 'pt42', source: 'p4', target: 't2', poids: '1', isError: false }, //HOMME -> HOMME++
    { id: 'tp26', source: 't2', target: 'p6', poids: '1', isError: false }, //---- CHEVRE -> CHEVRE++
    { id: 'tp28', source: 't2', target: 'p8', poids: '1', isError: false }, //---- HOMME -> HOMME++

    { id: 'pt33', source: 'p3', target: 't3', poids: '1', isError: false }, //LOUP -> LOUP++
    { id: 'pt43', source: 'p4', target: 't3', poids: '1', isError: false }, //HOMME -> HOMME++
    { id: 'tp37', source: 't3', target: 'p7', poids: '1', isError: false }, //---- LOUP -> LOUP++
    { id: 'tp38', source: 't3', target: 'p8', poids: '1', isError: false }, //---- HOMME -> HOMME++

    { id: 'pt44', source: 'p4', target: 't4', poids: '1', isError: false }, //HOMME SEUL -> HOMME++
    { id: 'tp48', source: 't4', target: 'p8', poids: '1', isError: false }, //---- HOMME SEUL -> HOMME++

    { id: 'pt55', source: 'p5', target: 't5', poids: '1', isError: false }, //RETOUR : CHOU -> CHOU++
    { id: 'pt85', source: 'p8', target: 't5', poids: '1', isError: false }, //RETOUR : HOMME -> HOMME++
    { id: 'tp51', source: 't5', target: 'p1', poids: '1', isError: false }, //RETOUR : ---- CHOU -> CHOU++
    { id: 'tp54', source: 't5', target: 'p4', poids: '1', isError: false }, //RETOUR : ---- HOMME -> HOMME++

    { id: 'pt66', source: 'p6', target: 't6', poids: '1', isError: false }, //RETOUR : CHEVRE -> CHEVRE++
    { id: 'pt86', source: 'p8', target: 't6', poids: '1', isError: false }, //RETOUR : HOMME -> HOMME++
    { id: 'tp62', source: 't6', target: 'p2', poids: '1', isError: false }, //RETOUR : ---- CHEVRE -> CHEVRE++
    { id: 'tp64', source: 't6', target: 'p4', poids: '1', isError: false }, //RETOUR : ---- HOMME -> HOMME++

    { id: 'pt77', source: 'p7', target: 't7', poids: '1', isError: false }, //RETOUR : LOUP -> LOUP++
    { id: 'pt87', source: 'p8', target: 't7', poids: '1', isError: false }, //RETOUR : HOMME -> HOMME++
    { id: 'tp73', source: 't7', target: 'p3', poids: '1', isError: false }, //RETOUR : ---- LOUP -> LOUP++
    { id: 'tp74', source: 't7', target: 'p4', poids: '1', isError: false }, //RETOUR : ---- HOMME -> HOMME++

    { id: 'pt88', source: 'p8', target: 't8', poids: '1', isError: false }, //RETOUR : HOMME SEUL -> HOMME++
    { id: 'tp84', source: 't8', target: 'p4', poids: '1', isError: false }, //RETOUR : ---- HOMME SEUL -> HOMME++

    { id: 'pt19', source: 'p1', target: 't9', poids: '1', isError: false }, //CHOU -> CHOU++
    { id: 'pt29', source: 'p2', target: 't9', poids: '1', isError: false }, //CHEVRE -> CHEVRE++
    { id: 'pt89', source: 'p8', target: 't9', poids: '1', isError: false }, //HOMME DE L'AUTRE COTE -> HOMME DE L'AUTRE COTE++
    { id: 'tp92', source: 't9', target: 'p2', poids: '1', isError: false }, //---- CHEVRE -> CHEVRE++
    { id: 'tp98', source: 't9', target: 'p8', poids: '1', isError: false }, //---- HOMME DE L'AUTRE COTE -> HOMME DE L'AUTRE COTE++

    { id: 'pt210', source: 'p2', target: 't10', poids: '1', isError: false }, //CHEVRE -> CHEVRE++
    { id: 'pt310', source: 'p3', target: 't10', poids: '1', isError: false }, //LOUP -> LOUP++
    { id: 'pt810', source: 'p8', target: 't10', poids: '1', isError: false }, //HOMME DE L'AUTRE COTE -> HOMME DE L'AUTRE COTE++
    { id: 'tp103', source: 't10', target: 'p3', poids: '1', isError: false }, //---- LOUP -> LOUP++
    { id: 'tp108', source: 't10', target: 'p8', poids: '1', isError: false }, //---- HOMME DE L'AUTRE COTE -> HOMME DE L'AUTRE COTE++

    { id: 'pt511', source: 'p5', target: 't11', poids: '1', isError: false }, //CHOU DE L'AUTRE COTE -> CHOU DE L'AUTRE COTE++
    { id: 'pt611', source: 'p6', target: 't11', poids: '1', isError: false }, //CHEVRE DE L'AUTRE COTE -> CHEVRE DE L'AUTRE COTE++
    { id: 'pt411', source: 'p4', target: 't11', poids: '1', isError: false }, //HOMME -> HOMME++
    { id: 'tp116', source: 't11', target: 'p6', poids: '1', isError: false }, //---- CHEVRE DE L'AUTRE COTE -> CHEVRE DE L'AUTRE COTE++
    { id: 'tp114', source: 't11', target: 'p4', poids: '1', isError: false }, //---- HOMME -> HOMME++

    { id: 'pt612', source: 'p6', target: 't12', poids: '1', isError: false }, //CHOU DE L'AUTRE COTE -> CHOU DE L'AUTRE COTE++
    { id: 'pt712', source: 'p7', target: 't12', poids: '1', isError: false }, //LOUP DE L'AUTRE COTE -> LOUP DE L'AUTRE COTE++
    { id: 'pt412', source: 'p4', target: 't12', poids: '1', isError: false }, //HOMME -> HOMME++
    { id: 'tp127', source: 't12', target: 'p7', poids: '1', isError: false }, //---- LOUP DE L'AUTRE COTE -> LOUP DE L'AUTRE COTE++
    { id: 'tp124', source: 't12', target: 'p4', poids: '1', isError: false }, //---- HOMME -> HOMME++
  ];

  indicateError(id: string, type: string) {
    if (type == 'place' || type == 'transition') {
      this.nodes.forEach((node) => {
        if (node.id == id) {
          node.isError = true;
          return;
        }
      });
    } else if (type == 'arc') {
      this.links.forEach((link) => {
        if (link.id == id) {
          link.isError = true;
          return;
        }
      });
    }
    this.checkError();
    this.renderGraph();
  }
  clearError() {
    this.nodes.forEach((node) => {
      node.isError = false;
    });
    this.links.forEach((link) => {
      link.isError = false;
    });
    this.removeError();
    this.renderGraph();
  }
}
