const fs = require('fs');
const path = 'src/app/pages/ecommerce/orders/orders.component.ts';
let content = fs.readFileSync(path, 'utf8');

// Fix 1: Restore Constructor
const oldConstructorPart = /constructor\(\s*public service: TransactionService,\s*private apiService: EcommerceService,\s*private spinner: NgxSpinnerService,\s*ngOnInit\(\)/;
const newConstructor = `constructor(
    public service: TransactionService,
    private apiService: EcommerceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pdf: PdfService,
    private csv: CsvService,
    private sheets: SheetsService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.transactions$ = service.transactions$;
    this.total$ = service.total$;
  }

  ngOnInit()`;

if (oldConstructorPart.test(content)) {
    content = content.replace(oldConstructorPart, newConstructor);
    console.log('Constructor fixed.');
} else {
    console.log('Could not find constructor part with regex.');
    // Try a more liberal match
    const liberalMatch = /constructor\([\s\S]*?private spinner: NgxSpinnerService,[\s\S]*?ngOnInit\(\)/;
    if (liberalMatch.test(content)) {
        content = content.replace(liberalMatch, newConstructor);
        console.log('Constructor fixed with liberal match.');
    }
}

// Fix 2: Fix Date logic corruption
content = content.replace(/\(new Date\(\) as any\)\(endDate\)/g, 'new Date(endDate)');
content = content.replace(/\(new Date\(\) as any\)\(\)/g, 'new Date()');

fs.writeFileSync(path, content, 'utf8');
console.log('File updated.');
