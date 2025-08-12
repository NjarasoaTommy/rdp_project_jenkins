import {
  Component,
  AfterViewInit,
  Input,
  OnInit,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ErrorNotificationComponent } from '../error-notification/error-notification.component';
import { GraphService } from '../services/graph-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rdp-graph',
  imports: [CommonModule, NgxGraphModule, ErrorNotificationComponent],
  templateUrl: './rdp-graph.component.html',
  styleUrl: './rdp-graph.component.css',
})
export class RdpGraphComponent implements AfterViewInit, OnInit {
  @Input() nodes: any[] = [];
  @Input() links: any[] = [];

  error = '';
  showError = false;

  errorSubscription: Subscription | null = null;
  showErrorSubscription: Subscription | null = null;
  nodesSubscription: Subscription | null = null;
  linksSubscription: Subscription | null = null;

  constructor(private graphService: GraphService, private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.graphService.checkError();
  }

  ngOnInit() {
    this.graphService.links = this.links;
    this.graphService.nodes = this.nodes;
    this.graphService.host = this.elRef.nativeElement;
    this.graphService.checkError();
    this.errorSubscription = this.graphService.errorSubject.subscribe(
      (err: string) => {
        this.error = err;
      }
    );
    this.graphService.emitErrorSubject();

    this.showErrorSubscription = this.graphService.showErrorSubject.subscribe(
      (isErr: boolean) => {
        this.showError = isErr;
      }
    );
    this.graphService.emitShowErrorSubject();

    this.linksSubscription = this.graphService.linksSubject.subscribe(
      (all_links: any[]) => {
        this.links = all_links;
      }
    );
    this.graphService.emitLinksSubject();

    this.nodesSubscription = this.graphService.nodesSubject.subscribe(
      (all_nodes: any[]) => {
        this.nodes = all_nodes;
      }
    );
    this.graphService.emitNodesSubject();
  }

  closeNotification() {
    this.graphService.closeNotification();
  }

  franchir(type: string, id: string) {
    this.graphService.franchir(type, id);
  }
}
