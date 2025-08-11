import { Component } from '@angular/core';
import { RdpGraphComponent } from '../rdp-graph/rdp-graph.component';

@Component({
  selector: 'app-tri-color-fire',
  imports: [RdpGraphComponent],
  templateUrl: './tri-color-fire.component.html',
  styleUrl: './tri-color-fire.component.css',
})
export class TriColorFireComponent {
  nodes = [
    {
      id: 'p1',
      label: 'P1',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: 'rouge',
      isError: false,
    },
    {
      id: 'p2',
      label: 'P2',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'vert',
      isError: false,
    },
    {
      id: 'p3',
      label: 'P3',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'orange',
      isError: false,
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
      isError: false,
    },
    {
      id: 'p6',
      label: 'P6',
      type: 'place',
      jetons: 0,
      capacity: 1,
      couleur: 'orange',
      isError: false,
    },
    {
      id: 'p7',
      label: 'P7',
      type: 'place',
      jetons: 1,
      capacity: 1,
      couleur: '',
      isError: false,
    },
    {
      id: 't1',
      label: 'T1',
      type: 'transition_verticale',
      couleur: '',
      isError: false,
    },
    {
      id: 't2',
      label: 'T2',
      type: 'transition_verticale',
      couleur: '',
      isError: false,
    },
    {
      id: 't3',
      label: 'T3',
      type: 'transition_verticale',
      couleur: '',
      isError: false,
    },
    {
      id: 't4',
      label: 'T4',
      type: 'transition_verticale',
      couleur: '',
      isError: false,
    },
    {
      id: 't5',
      label: 'T5',
      type: 'transition_verticale',
      couleur: '',
      isError: false,
    },
    {
      id: 't6',
      label: 'T6',
      type: 'transition_verticale',
      couleur: '',
      isError: false,
    },
  ];

  links = [
    { id: 'pt11', source: 'p1', target: 't1', poids: '1', isError: false }, //R1 -> V1
    { id: 'pt71', source: 'p7', target: 't1', poids: '1', isError: false }, //pontrol -> V1
    { id: 'tp12', source: 't1', target: 'p2', poids: '1', isError: false }, //---> V1
    { id: 'pt22', source: 'p2', target: 't2', poids: '1', isError: false }, //V1 -> O1
    { id: 'tp23', source: 't2', target: 'p3', poids: '1', isError: false }, //---> O1
    { id: 'pt33', source: 'p3', target: 't3', poids: '1', isError: false }, //O1 -> R1|Control
    { id: 'tp31', source: 't3', target: 'p1', poids: '1', isError: false }, //---> R1
    { id: 'tp37', source: 't3', target: 'p7', poids: '1', isError: false }, //--->Control

    { id: 'pt44', source: 'p4', target: 't4', poids: '1', isError: false }, //R2 -> V2
    { id: 'pt74', source: 'p7', target: 't4', poids: '1', isError: false }, //Control -> V2
    { id: 'tp45', source: 't4', target: 'p5', poids: '1', isError: false }, //---> V2
    { id: 'pt55', source: 'p5', target: 't5', poids: '1', isError: false }, //V2 -> O2
    { id: 'tp56', source: 't5', target: 'p6', poids: '1', isError: false }, //---> O2
    { id: 'pt66', source: 'p6', target: 't6', poids: '1', isError: false }, //O2 -> R2|Control
    { id: 'tp64', source: 't6', target: 'p4', poids: '1', isError: false }, //---> R2
    { id: 'tp67', source: 't6', target: 'p7', poids: '1', isError: false }, //---> Control
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
