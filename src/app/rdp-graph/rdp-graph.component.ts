import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule, GraphComponent } from '@swimlane/ngx-graph';
import { ErrorNotificationComponent } from '../error-notification/error-notification.component';

@Component({
  selector: 'app-rdp-graph',
  imports: [CommonModule, NgxGraphModule, ErrorNotificationComponent],
  templateUrl: './rdp-graph.component.html',
  styleUrl: './rdp-graph.component.css',
})
export class RdpGraphComponent implements AfterViewInit {
  @Input() nodes: any[] = [];
  @Input() links: any[] = [];

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
        if (id == 't9' || id == 't11') {
          this.removeNode('t9');
          this.removeNode('t11');
          this.removeNode('p1');
          this.removeNode('p5');
          this.removeNode('t1');
          this.removeNode('t5');
        } else if (id == 't10' || id == 't12') {
          this.removeNode('t10');
          this.removeNode('t12');
          this.removeNode('p2');
          this.removeNode('p6');
          this.removeNode('t2');
          this.removeNode('t6');
          this.renderGraph();
        }
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
    if (node && node.capacity) {
      if (jet < parseInt(val[1])) {
        return (
          'La place de départ(' +
          node.label +
          ") n'a pas suffisament de jeton : " +
          node.jetons +
          ' < capacité arc : ' +
          val[1] +
          '.'
        );
      } else if (jet - parseInt(val[1]) + parseInt(val[2]) > node.capacity) {
        return (
          'La capacité maximale(' +
          node.capacity +
          ') de la place(' +
          node.label +
          ') sera dépassée car la place(' +
          node.label +
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
        ") n'a pas suffisament de jeton : " +
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

  removeNode(id: string) {
    this.nodes = this.nodes.filter((node: any) => node.id != id);
    this.links = this.links.filter(
      (link: any) => link.source != id && link.target != id
    );
  }
}
