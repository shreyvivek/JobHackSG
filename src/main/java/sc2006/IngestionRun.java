package sc2006;
import java.io.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 
 */
public class IngestionRun {

    /**
     * Default constructor
     */
    public IngestionRun() {
    }

    /**
     * 
     */
    private int runId;

    /**
     * 
     */
    private LocalDateTime startedAt;

    /**
     * 
     */
    private LocalDateTime endedAt;

    /**
     * 
     */
    private String status;

    /**
     * 
     */
    private int  inserted;

    /**
     * 
     */
    private int updated;

    /**
     * 
     */
    private int failed;

}